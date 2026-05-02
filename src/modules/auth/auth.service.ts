import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserDTO } from "../entities/users/dto/users.dto";
import { JWTUserPayloadDTO, TokenAnswerDTO } from "./jwt/jwt.dto";
import { decryptTelegramAuthPayload } from "./utils/decriptASE.utils";

@Injectable()
export class AuthService {
    constructor (
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async generateJWTTokens (payload: JWTUserPayloadDTO): Promise<TokenAnswerDTO> {
        const accessTokenExpiresIn = 60 * 60 * 24;
        const refreshTokenExpiresIn = 60 * 60 * 24 * 14;

        const accessToken = this.jwt.sign({
            ...payload,
            tokenType: 'access'
        }, {
            secret: process.env.JWT_ACCESS_SECRET_KEY,
            expiresIn: accessTokenExpiresIn
        });

        const refreshToken = this.jwt.sign({
            ...payload,
            tokenType: 'refresh'
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

    async loginFromWeb () {

    }

    async loginFromTelegram (auth: string): Promise<TokenAnswerDTO> {
        const payload = decryptTelegramAuthPayload(auth);

        if (!payload.tgChatId) {
            throw new UnauthorizedException('chatId из телеграм не был извлечен');
        }

        let user = await this.prisma.users.findUnique({
            where: {
                tgChatId: payload.tgChatId
            }
        });

        if (!user) {
            user = await this.prisma.users.create({
                data: {
                    tgChatId: payload.tgChatId,
                    tgUserName: payload.tgUserName,
                    password: ''
                }
            });
        }

        const JWTTokens = await this.generateJWTTokens({ id: user.id });
        return JWTTokens;
    }

    async getMe (user: UserDTO) {
        const fullProfile = await this.prisma.users.findUnique({
            where: {
                id: user.id
            },
            include: {
                profile: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!fullProfile) {
            throw new NotFoundException('Ваш профиль вероятно был удален');
        }

        return fullProfile;
    }
}
