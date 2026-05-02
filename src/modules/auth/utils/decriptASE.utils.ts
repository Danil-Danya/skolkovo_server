import { UnauthorizedException } from "@nestjs/common";
import * as CryptoJS from "crypto-js";

export const decryptTelegramAuthPayload = (auth: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(auth, process.env.TG_AUTH_SECRET_KEY);
        const json = bytes.toString(CryptoJS.enc.Utf8);

        if (!json) {
            throw new UnauthorizedException("Некорректная ссылка авторизации");
        }

        return JSON.parse(json);
    }
    catch (error) {
        throw new UnauthorizedException("Некорректная ссылка авторизации");
    }
}
