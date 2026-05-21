import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateFollowerDTO, FollowerAnswerDTO, UserFollowStatus } from "./dto/follower.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";

@Injectable()
export class FollowersService {
    constructor (private prisma: PrismaService) {}

    async createFollower (data: CreateFollowerDTO): Promise<FollowerAnswerDTO> {
        const createdFollower = await this.prisma.followers.create({
            data: {
                ...data,
                status: UserFollowStatus.FOLLOW
            }
        });

        if (!createdFollower) {
            throw new InternalServerErrorException("Ошибка при создании подписчика");
        }

        return createdFollower as FollowerAnswerDTO;
    }

    async deleteFollower (id: string): Promise<DeletedMessageDTO> {
        const followerExists = await this.prisma.followers.findUnique({ where: { id } });

        if (!followerExists) {
            throw new NotFoundException("Подписчик не найден");
        }

        await this.prisma.followers.delete({ where: { id } });

        return {
            message: "Подписчик успешно удален"
        };
    }

    async updateStatusFollower (id: string, status: string): Promise<FollowerAnswerDTO> {
        const followerExists = await this.prisma.followers.findUnique({ where: { id } });

        if (!followerExists) {
            throw new NotFoundException("Подписчик не найден");
        }

        const updatedFollower = await this.prisma.followers.update({
            where: { id },
            data: {
                status
            }
        });

        if (!updatedFollower) {
            throw new InternalServerErrorException("Ошибка при обновлении статуса подписчика");
        }

        return updatedFollower as FollowerAnswerDTO;
    }
}
