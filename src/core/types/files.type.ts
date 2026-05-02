export type UploadedFile = {
    buffer: Buffer;
    fieldname: string;
    mimetype: string;
    originalname: string;
    size: number;
};

export type UploadedStaticFile = UploadedFile & {
    destination: string;
    filename: string;
    path: string;
    url: string;
    textContent?: string;
};