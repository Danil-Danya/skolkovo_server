import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type, mixin } from "@nestjs/common";

import { randomUUID } from "crypto";
import { mkdir, stat, writeFile } from "fs/promises";
import { extname, join } from "path";

import sharp from "sharp";
import * as XLSX from "xlsx";

import type { Request } from "express";
import { UploadedFile, UploadedStaticFile } from "../types/files.type";

const normalizeFolder = (folder: string): string => {
    const normalizedFolder = folder
        .split(/[\\/]/)
        .filter(Boolean)
        .filter((part) => part !== "." && part !== "..")
        .join("/");

    return normalizedFolder || "files";
}


const saveFileToStatic = async (file: UploadedFile, folder: string): Promise<UploadedStaticFile> => {
    const staticFolder = normalizeFolder(folder);
    const destination = join(process.cwd(), "static", staticFolder);

    await mkdir(destination, { recursive: true });

    const isImage = file.mimetype.startsWith("image/");
    const extension = isImage ? ".webp" : extname(file.originalname).toLowerCase() || ".bin";
    const filename = `${randomUUID()}${extension}`;
    const filePath = join(destination, filename);

    if (isImage) {
        await sharp(file.buffer)
            .rotate()
            .webp({ quality: 80 })
            .toFile(filePath);
    }
    else {
        await writeFile(filePath, file.buffer);
    }

    const fileStats = await stat(filePath);

    return {
        ...file,
        destination,
        filename,
        mimetype: isImage ? "image/webp" : file.mimetype,
        originalname: file.originalname,
        path: filePath,
        size: fileStats.size,
        url: `/static/${staticFolder}/${filename}`,
    };
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