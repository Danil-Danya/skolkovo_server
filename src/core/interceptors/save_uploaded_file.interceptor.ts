import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type, mixin } from "@nestjs/common";

import { randomUUID } from "crypto";
import { mkdir, stat, writeFile } from "fs/promises";
import { extname, join } from "path";

import { Jimp } from "jimp";

import type { Request } from "express";
import { UploadedFile, UploadedFilesMap, UploadedStaticFile, UploadedStaticFilesMap } from "../types/files.type";

const normalizeFolder = (folder: string): string => {
    const normalizedFolder = folder
        .split(/[\\/]/)
        .filter(Boolean)
        .filter((part) => part !== "." && part !== "..")
        .join("/");

    return normalizedFolder || "files";
}

const compressImage = async (file: UploadedFile): Promise<{
    buffer: Buffer;
    extension: string;
    mimetype: string;
}> => {
    const image = await Jimp.read(file.buffer);

    if (image.hasAlpha()) {
        return {
            buffer: await image.getBuffer("image/png", {
                compressionLevel: 9
            }),
            extension: ".png",
            mimetype: "image/png"
        };
    }

    return {
        buffer: await image.getBuffer("image/jpeg", {
            quality: 80
        }),
        extension: ".jpg",
        mimetype: "image/jpeg"
    };
}

const saveFileToStatic = async (file: UploadedFile, folder: string): Promise<UploadedStaticFile> => {
    const staticFolder = normalizeFolder(folder);
    const destination = join(process.cwd(), "static", staticFolder);

    await mkdir(destination, { recursive: true });

    const isImage = file.mimetype.startsWith("image/");
    const processedImage = isImage ? await compressImage(file) : null;
    const originalExtension = extname(file.originalname).toLowerCase();
    const extension = processedImage?.extension ?? (originalExtension || ".bin");
    const filename = `${randomUUID()}${extension}`;
    const filePath = join(destination, filename);

    await writeFile(filePath, processedImage?.buffer ?? file.buffer);

    const fileStats = await stat(filePath);

    return {
        ...file,
        destination,
        filename,
        mimetype: processedImage?.mimetype ?? file.mimetype,
        originalname: file.originalname,
        path: filePath,
        size: fileStats.size,
        url: `/static/${staticFolder}/${filename}`,
    };
}

const saveFilesMapToStatic = async (files: UploadedFilesMap, folder: string): Promise<UploadedStaticFilesMap> => {
    const savedFiles = await Promise.all(
        Object.entries(files).map(async ([fieldName, fieldFiles]) => {
            return [
                fieldName,
                await Promise.all(fieldFiles.map((file) => saveFileToStatic(file, folder)))
            ] as const;
        })
    );

    return Object.fromEntries(savedFiles);
}

export const SaveUploadedFileInterceptor = (folder = "files"): Type<NestInterceptor> => {
    @Injectable()
    class SaveUploadedFileMixinInterceptor implements NestInterceptor {
        public async intercept (context: ExecutionContext, next: CallHandler) {
            const request = context.switchToHttp().getRequest<Request & { file?: UploadedFile }>();

            if (request.file) {
                request.file = await saveFileToStatic(request.file, folder);
            }

            return next.handle();
        }
    }

    return mixin(SaveUploadedFileMixinInterceptor);
}

export const SaveUploadedFilesInterceptor = (folder = "files"): Type<NestInterceptor> => {
    @Injectable()
    class SaveUploadedFilesMixinInterceptor implements NestInterceptor {
        public async intercept (context: ExecutionContext, next: CallHandler) {
            const request = context.switchToHttp().getRequest<Request & {
                files?: UploadedFilesMap | UploadedFile[];
            }>();

            if (request.files) {
                request.files = Array.isArray(request.files)
                    ? await Promise.all(request.files.map((file) => saveFileToStatic(file, folder)))
                    : await saveFilesMapToStatic(request.files, folder);
            }

            return next.handle();
        }
    }

    return mixin(SaveUploadedFilesMixinInterceptor);
}
