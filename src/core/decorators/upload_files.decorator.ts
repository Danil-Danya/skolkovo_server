import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { SaveUploadedFilesInterceptor } from "../interceptors/save_uploaded_file.interceptor";

type UploadField = {
    name: string;
    maxCount?: number;
};

export const UploadFiles = (fields: UploadField[], folder = "files") => {
    return applyDecorators(
        UseInterceptors(
            FileFieldsInterceptor(fields),
            SaveUploadedFilesInterceptor(folder)
        )
    );
}
