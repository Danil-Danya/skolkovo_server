import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateUserDTO, UpdateUserDTO, UserAnswerDTO } from "./dto/users.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class UsersService {
    constructor (private prisma: PrismaService) {}

    async createUser (data: CreateUserDTO): Promise<UserAnswerDTO> {
        const userExist = await this.prisma.users.findUnique({ 
            where: { 
                tgChatId: data.tgChatId 
            } 
        });

        if (userExist) {
            throw new BadRequestException('Данный пользователь уже сущестует');
        }

        const createdUser = await this.prisma.users.create({
            data: {
                ...data,
                password: data.password ?? ''
            }
        });
        if (!createdUser) {
            throw new InternalServerErrorException('Ошибка сервера. Не получилось создать пользователя');
        }

        return createdUser;
    }

    async deleteUser (id: string): Promise<DeletedMessageDTO> {
        const userExist = await this.prisma.users.findUnique({ 
            where: { 
                id
            } 
        });

        if (!userExist) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        await this.prisma.users.delete({
            where: {
                id
            }
        })

        return {
            message: 'Пользователь был успешно удален'
        }
    }

    async getOneUserById (id: string): Promise<UserAnswerDTO> {
        const user = await this.prisma.users.findUnique({ 
            where: { 
                id
            } 
        });

        if (!user) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        return user;
    }

    async getOneUserByChatId (chatId: string): Promise<UserAnswerDTO> {
        const user = await this.prisma.users.findUnique({ 
            where: { 
                tgChatId: chatId
            } 
        });

        if (!user) {
            throw new NotFoundException('Данный пользователь не был найден');
        }

        return user;
    }

    async getAllUsersByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
        const whereClause = {};
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

        const skip = (page - 1) * limit;

        const users = await findAndPaginate(this.prisma.users, {
            where: whereClause,
            orderBy: order,
            page,
            limit,
            select: {
                id: true,
                tgChatId: true,
                tgUserName: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return users;
    }

    async updateUser (id: string, data: UpdateUserDTO): Promise<UserAnswerDTO> {
        const userExist = await this.prisma.users.findUnique({ 
            where: { 
                id
            } 
        });

        if (!userExist) {
            throw new NotFoundException('Данный пользователь не был найден');
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
