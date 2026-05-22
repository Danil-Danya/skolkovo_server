import bcrypt from "bcrypt";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserDTO } from "../entities/users/dto/users.dto";
import { USER_SELECT } from "../entities/users/types/user.types";
import {
    JWTUserPayloadDTO,
    TelegramBotRegisterAnswerDTO,
    TelegramBotRegisterDTO,
    TokenAnswerDTO
} from "./jwt/jwt.dto";
import { decryptTelegramAuthPayload } from "./utils/decriptASE.utils";
import { NotificationService } from "../entities/notificatations/notification.service";

@Injectable()
export class AuthService {
    constructor (
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private jwt: JwtService
    ) {}

    private normalizeTelegramUsername (username?: string | null): string | null {
        if (!username) {
            return null;
        }

        const normalizedUsername = username.trim().replace(/^@+/, "");
        return normalizedUsername.length > 0 ? normalizedUsername : null;
    }

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

    async applyAccount (id: string) {
        await this.notificationService.createNotificationsForAnyUser({
            title: "Ваша заявка на участие в Клубе Строителей Сколково была одобрена",
            text: "Поздравляем! Ваша заявка на участие в Клубе Строителей Сколково была одобрена. Вы можете начать использовать все возможности нашего сервиса.",
            userIds: [id]
        });

        return await this.updateAccountStatus(id, UserStatus.ACTIVE);
    }

    async banAccount (id: string) {
            await this.notificationService.createNotificationsForAnyUser({
                title: "Ваша заявка на участие в Клубе Строителей Сколково была отклонена",
                text: "Мы сожалеем, но ваша заявка на участие в Клубе Строителей Сколково была отклонена.",
                userIds: [id]
            });

        return await this.updateAccountStatus(id, UserStatus.BANNED);
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
        const normalizedUsername = this.normalizeTelegramUsername(tgUserName);

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

        const normalizedUsername = this.normalizeTelegramUsername(payload.tgUserName);

        let user = await this.prisma.users.findFirst({
            where: {
                tgChatId: payload.tgChatId,
                deletedAt: null
            }
        });

        if (!user) {
            user = await this.prisma.users.create({
                data: {
                    tgChatId: payload.tgChatId,
                    tgUserName: normalizedUsername,
                    password: ""
                }
            });
        }
        else if (normalizedUsername && user.tgUserName !== normalizedUsername) {
            user = await this.prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    tgUserName: normalizedUsername
                }
            });
        }

        const JWTTokens = await this.generateJWTTokens({ id: user.id });
        return JWTTokens;
    }

    async registerTelegramBot (data: TelegramBotRegisterDTO): Promise<TelegramBotRegisterAnswerDTO> {
        const normalizedUsername = this.normalizeTelegramUsername(data.username);

        return await this.prisma.$transaction(async (tx) => {
            let isNewUser = false;
            let isNewProfile = false;

            let user = await tx.users.findFirst({
                where: {
                    tgChatId: data.chatId,
                    deletedAt: null
                }
            });

            if (!user) {
                user = await tx.users.create({
                    data: {
                        tgChatId: data.chatId,
                        tgUserName: normalizedUsername,
                        password: ""
                    }
                });
                isNewUser = true;
            }
            else if (normalizedUsername && user.tgUserName !== normalizedUsername) {
                user = await tx.users.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        tgUserName: normalizedUsername
                    }
                });
            }

            let profile = await tx.profiles.findUnique({
                where: {
                    userId: user.id
                }
            });

            if (!profile) {
                profile = await tx.profiles.create({
                    data: {
                        userId: user.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        tgUser: normalizedUsername ?? undefined
                    }
                });
                isNewProfile = true;
            }
            else {
                profile = await tx.profiles.update({
                    where: {
                        id: profile.id
                    },
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        tgUser: normalizedUsername ?? profile.tgUser
                    }
                });
            }

            return {
                userId: user.id,
                profileId: profile.id,
                chatId: user.tgChatId ?? data.chatId,
                username: user.tgUserName ?? profile.tgUser ?? null,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                isNewUser,
                isNewProfile
            };
        });
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
