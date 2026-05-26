import bcrypt from "bcrypt";

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UserRolesService } from "../roles/user_roles.service";
import { CreateUserDTO, UpdateUserDTO, UserAnswerDTO } from "./dto/users.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";
import { USER_SELECT } from "./types/user.types";

@Injectable()
export class UsersService {
    constructor (
        private prisma: PrismaService,
        private userRolesService: UserRolesService
    ) {}

    private async getActiveUserById (id: string) {
        return await this.prisma.users.findFirst({
            where: {
                id,
                deletedAt: null
            },
            select: USER_SELECT
        });
    }

    async createUser (data: CreateUserDTO): Promise<UserAnswerDTO> {
        if (data.tgChatId) {
            const userExist = await this.prisma.users.findFirst({ 
                where: { 
                    tgChatId: data.tgChatId,
                    deletedAt: null
                } 
            });

            if (userExist) {
                throw new BadRequestException('Данный пользователь уже сущестует');
            }
        }

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));
            data.password = hashedPassword;
        }

        const createdUser = await this.prisma.$transaction(async (tx) => {
            const createdUser = await tx.users.create({
                data: {
                    ...data,
                    password: data.password ?? ''
                }
            });

            await this.userRolesService.ensureUserDefaultRole(createdUser.id, tx);

            return createdUser;
        });
        if (!createdUser) {
            throw new InternalServerErrorException('Ошибка сервера. Не получилось создать пользователя');
        }

        return createdUser;
    }

    async deleteUser (id: string): Promise<DeletedMessageDTO> {
        const userExist = await this.getActiveUserById(id);

        if (!userExist) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        await this.prisma.$executeRaw`
            DELETE FROM "users"
            WHERE "id" = ${id}
        `;

        return {
            message: 'Пользователь был успешно удален'
        }
    }

    async getOneUserById (id: string): Promise<UserAnswerDTO> {
        const user = await this.getActiveUserById(id);

        if (!user) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        return user;
    }

    async getOneUserByChatId (chatId: string): Promise<UserAnswerDTO> {
        const user = await this.prisma.users.findFirst({ 
            where: { 
                tgChatId: chatId,
                deletedAt: null
            },
            select: {
                id: true,
                tgChatId: true,
                tgUserName: true,
                createdAt: true,
                updatedAt: true
            },
        });

        if (!user) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        return user;
    }

    async getOneUserByUsername (tgUserName: string): Promise<UserAnswerDTO> {
        const normalizedUsername = tgUserName?.trim().replace(/^@+/, "");

        if (!normalizedUsername) {
            throw new BadRequestException("Не передан tgUserName");
        }

        const user = await this.prisma.users.findFirst({ 
            where: { 
                deletedAt: null,
                tgUserName: {
                    equals: normalizedUsername,
                    mode: "insensitive"
                }
            },
            select: USER_SELECT
        });

        if (!user) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        return user;
    }

    async getAllUsersByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
        const whereClause: Record<string, unknown> = {
            deletedAt: null
        };
        let order = {};

        const page = paginate?.page ?? 1;
        const limit = paginate?.limit ?? 10;

        if (filters?.where && filters?.whereField) {
            whereClause[filters.whereField] = filters.where;
        }

        if (filters?.search && filters?.searchField) {
            whereClause[filters.searchField] = {
                contains: filters.search,
                mode: 'insensitive'
            };
        }

        if (filters?.order && filters?.orderBy) {
            order = { [filters.orderBy]: filters.order };
        }

        const users = await findAndPaginate(this.prisma.users, {
            where: whereClause,
            orderBy: order,
            page,
            limit,
            select: USER_SELECT,
        });

        return users;
    }

    async updateUser (id: string, data: UpdateUserDTO): Promise<UserAnswerDTO> {
        const userExist = await this.getActiveUserById(id);

        if (!userExist) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));
            data.password = hashedPassword;
        }

        const updatedUser = await this.prisma.users.update({
            where: {
                id
            },
            data
        });

        if (!updatedUser) {
            throw new InternalServerErrorException('Ошибка сервера! Не получилось обновить пользователя');
        }

        return updatedUser;
    } 
}
