import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserRolesService } from "src/modules/entities/roles/user_roles.service";
import { PrismaService } from "src/database/prisma/prisma.service";
import { TelegramBotRegisterAnswerDTO, TelegramBotRegisterDTO } from "../jwt/jwt.dto";
import { normalizeTelegramUsername } from "../utils/normalize_username.utils";

type TelegramIdentityDTO = {
    chatId: string;
    username?: string;
};

@Injectable()
export class TelegramAccountService {
    constructor (
        private prisma: PrismaService,
        private userRolesService: UserRolesService
    ) {}

    private async upsertTelegramUser (tx: Prisma.TransactionClient, identity: TelegramIdentityDTO) {
        const normalizedUsername = normalizeTelegramUsername(identity.username);
        let isNewUser = false;

        let user = await tx.users.findFirst({
            where: {
                tgChatId: identity.chatId,
                deletedAt: null
            }
        });

        if (!user) {
            user = await tx.users.create({
                data: {
                    tgChatId: identity.chatId,
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

        await this.userRolesService.ensureUserDefaultRole(user.id, tx);

        return {
            user,
            isNewUser,
            normalizedUsername
        };
    }

    private async upsertTelegramProfile (
        tx: Prisma.TransactionClient,
        userId: string,
        data: TelegramBotRegisterDTO,
        normalizedUsername: string | null
    ) {
        let isNewProfile = false;

        let profile = await tx.profiles.findUnique({
            where: {
                userId
            }
        });

        if (!profile) {
            profile = await tx.profiles.create({
                data: {
                    userId,
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
            profile,
            isNewProfile
        };
    }

    private buildTelegramRegisterAnswer (
        data: TelegramBotRegisterDTO,
        user: {
            id: string;
            tgChatId: string | null;
            tgUserName: string | null;
        },
        profile: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            tgUser: string | null;
        },
        isNewUser: boolean,
        isNewProfile: boolean
    ): TelegramBotRegisterAnswerDTO {
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
    }

    async syncTelegramUser (identity: TelegramIdentityDTO) {
        return await this.prisma.$transaction(async (tx) => {
            const { user } = await this.upsertTelegramUser(tx, identity);
            return user;
        });
    }

    async registerTelegramBot (data: TelegramBotRegisterDTO): Promise<TelegramBotRegisterAnswerDTO> {
        return await this.prisma.$transaction(async (tx) => {
            const { user, isNewUser, normalizedUsername } = await this.upsertTelegramUser(tx, {
                chatId: data.chatId,
                username: data.username
            });
            const { profile, isNewProfile } = await this.upsertTelegramProfile(tx, user.id, data, normalizedUsername);

            return this.buildTelegramRegisterAnswer(data, user, profile, isNewUser, isNewProfile);
        });
    }
}
