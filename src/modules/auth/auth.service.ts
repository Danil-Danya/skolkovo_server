import bcrypt from "bcrypt";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserAnswerDTO, UserDTO } from "../entities/users/dto/users.dto";
import { USER_SELECT } from "../entities/users/types/user.types";
import { TelegramAccountService } from "./services/telegram-account.service";

import {
    JWTUserPayloadDTO,
    TelegramBotRegisterAnswerDTO,
    TelegramBotRegisterDTO,
    TokenAnswerDTO
} from "./jwt/jwt.dto";

import { decryptTelegramAuthPayload } from "./utils/decriptASE.utils";
import { NotificationService } from "../entities/notificatations/notification.service";
import { normalizeTelegramUsername } from "./utils/normalize_username.utils";
import {
    applyAccount as applyAccountWithNotification,
    banAccount as banAccountWithNotification
} from "./utils/notification_user.util";

@Injectable()
export class AuthService {
    constructor (
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private jwt: JwtService,
        private telegramAccountService: TelegramAccountService
    ) {}

    private async updateAccountStatus (id: string, status: UserStatus) {
        const accountExist = await this.prisma.users.findFirst({
            where: {
                id,
                deletedAt: null
            },
            select: USER_SELECT
        });

        if (!accountExist) {
            throw new NotFoundException("Пользователь не найден");
        }

        return await this.prisma.users.update({
            where: {
                id
            },
            data: {
                status
            },
            select: USER_SELECT
        });
    }

    async applyAccount (id: string): Promise<UserAnswerDTO> {
        return await applyAccountWithNotification<UserAnswerDTO>({
            id,
            notificationService: this.notificationService,
            updateAccountStatus: this.updateAccountStatus.bind(this)
        });
    }

    async banAccount (id: string): Promise<UserAnswerDTO> {
        return await banAccountWithNotification<UserAnswerDTO>({
            id,
            notificationService: this.notificationService,
            updateAccountStatus: this.updateAccountStatus.bind(this)
        });
    }

    async generateJWTTokens (payload: JWTUserPayloadDTO): Promise<TokenAnswerDTO> {
        const accessTokenExpiresIn = 60 * 60 * 24;
        const refreshTokenExpiresIn = 60 * 60 * 24 * 14;

        const accessToken = this.jwt.sign({
            ...payload,
            tokenType: "access"
        }, {
            secret: process.env.JWT_ACCESS_SECRET_KEY,
            expiresIn: accessTokenExpiresIn
        });

        const refreshToken = this.jwt.sign({
            ...payload,
            tokenType: "refresh"
        }, {
            secret: process.env.JWT_REFRESH_SECRET_KEY,
            expiresIn: refreshTokenExpiresIn
        });

        const now = Math.floor(Date.now() / 1000);

        return {
            accessToken: {
                token: accessToken,
                expiriesAt: now + accessTokenExpiresIn
            },
            refreshToken: {
                token: refreshToken,
                expiriesAt: now + refreshTokenExpiresIn
            }
        };
    }

    async loginAdmin (tgUserName: string, password: string): Promise<TokenAnswerDTO> {
        const normalizedUsername = normalizeTelegramUsername(tgUserName);

        if (!normalizedUsername) {
            throw new UnauthorizedException("Неверный username или пароль");
        }

        const user = await this.prisma.users.findFirst({
            where: {
                deletedAt: null,
                tgUserName: {
                    equals: normalizedUsername,
                    mode: "insensitive"
                }
            }
        });

        if (!user || !user.password) {
            throw new UnauthorizedException("Неверный username или пароль");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Неверный username или пароль");
        }

        return await this.generateJWTTokens({ id: user.id });
    }

    async loginFromTelegram (auth: string): Promise<TokenAnswerDTO> {
        const payload = decryptTelegramAuthPayload(auth);

        if (!payload.tgChatId) {
            throw new UnauthorizedException("chatId из telegram не был извлечен");
        }

        const user = await this.telegramAccountService.syncTelegramUser({
            chatId: payload.tgChatId,
            username: payload.tgUserName
        });

        const JWTTokens = await this.generateJWTTokens({ id: user.id });
        return JWTTokens;
    }

    async registerTelegramBot (data: TelegramBotRegisterDTO): Promise<TelegramBotRegisterAnswerDTO> {
        return await this.telegramAccountService.registerTelegramBot(data);
    }

    async getMe (user: UserDTO) {
        const fullProfile = await this.prisma.users.findFirst({
            where: {
                id: user.id,
                deletedAt: null
            },
            select: USER_SELECT
        });

        if (!fullProfile) {
            throw new NotFoundException("Ваш профиль вероятно был удален");
        }

        return fullProfile;
    }
}
