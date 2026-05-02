import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SaveUploadedFileInterceptor } from "../interceptors/save_uploaded_file.interceptor";

export const UploadFile = (fieldName = "file", folder = "files") => {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName),
            SaveUploadedFileInterceptor(folder)
        )
    );
}