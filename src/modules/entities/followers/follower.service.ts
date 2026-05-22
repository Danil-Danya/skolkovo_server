import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateFollowerDTO, FollowerAnswerDTO, UserFollowStatus } from "./dto/follower.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";
import { NotificationService } from "../notificatations/notification.service";
import { NotificationActionType } from "../notificatations/dto/notification.dto";
import { createFollowerRequestNotification } from "../notificatations/integrations/bot/query_bot.notification";

@Injectable()
export class FollowersService {
    constructor (
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) {}

    private getUserDisplayName (user: {
        tgUserName?: string | null;
        profile?: {
            firstName?: string | null;
            lastName?: string | null;
        } | null;
    }) {
        const fullName = [
            user.profile?.firstName?.trim(),
            user.profile?.lastName?.trim()
        ].filter(Boolean).join(" ");

        if (fullName.length > 0) {
            return fullName;
        }

        if (user.tgUserName?.trim()) {
            return `@${user.tgUserName.trim()}`;
        }

        return "Пользователь";
    }

    private async notifyFollowerAboutDecision (follower: FollowerAnswerDTO) {
        const title = follower.status === UserFollowStatus.FOLLOW
            ? "Ваш запрос на подписку одобрен"
            : "Ваш запрос на подписку отклонен";
        const text = follower.status === UserFollowStatus.FOLLOW
            ? "Пользователь одобрил ваш запрос на подписку."
            : "Пользователь отклонил ваш запрос на подписку.";

        await this.notificationService.createNotificationsForAnyUser({
            title,
            text,
            userIds: [follower.followerId],
            actionLinks: [
                {
                    label: "Смотреть в приложении",
                    type: NotificationActionType.MINI_APP
                }
            ]
        });
    }

    async createFollower (data: CreateFollowerDTO): Promise<FollowerAnswerDTO> {
        if (data.followerId === data.followingId) {
            throw new BadRequestException("Нельзя подписаться на самого себя");
        }

        const [followerUser, followingUser, existingFollower] = await Promise.all([
            this.prisma.users.findFirst({
                where: {
                    id: data.followerId,
                    deletedAt: null
                },
                select: {
                    id: true,
                    tgUserName: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }),
            this.prisma.users.findFirst({
                where: {
                    id: data.followingId,
                    deletedAt: null
                },
                select: {
                    id: true,
                    tgChatId: true,
                    tgUserName: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }),
            this.prisma.followers.findFirst({
                where: {
                    followerId: data.followerId,
                    followingId: data.followingId
                }
            })
        ]);

        if (!followerUser || !followingUser) {
            throw new NotFoundException("Пользователь не найден");
        }

        if (existingFollower?.status === UserFollowStatus.FOLLOW) {
            return existingFollower as FollowerAnswerDTO;
        }

        if (existingFollower?.status === UserFollowStatus.PENDING) {
            return existingFollower as FollowerAnswerDTO;
        }

        const nextStatus = followingUser.tgChatId
            ? UserFollowStatus.PENDING
            : UserFollowStatus.FOLLOW;

        const createdFollower = existingFollower
            ? await this.prisma.followers.update({
                where: {
                    id: existingFollower.id
                },
                data: {
                    status: nextStatus
                }
            })
            : await this.prisma.followers.create({
                data: {
                    ...data,
                    status: nextStatus
                }
            });

        if (followingUser.tgChatId) {
            try {
                await createFollowerRequestNotification({
                    chatId: followingUser.tgChatId,
                    requestId: createdFollower.id,
                    followerId: createdFollower.followerId,
                    followingId: createdFollower.followingId,
                    followerName: this.getUserDisplayName(followerUser),
                    followerUserName: followerUser.tgUserName
                });
            }
            catch (error) {
                if (existingFollower) {
                    await this.prisma.followers.update({
                        where: {
                            id: existingFollower.id
                        },
                        data: {
                            status: existingFollower.status
                        }
                    });
                }
                else {
                    await this.prisma.followers.delete({
                        where: {
                            id: createdFollower.id
                        }
                    });
                }

                throw error;
            }
        }

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

    async answerFollowerRequest (id: string, status: UserFollowStatus): Promise<FollowerAnswerDTO> {
        if (status !== UserFollowStatus.FOLLOW && status !== UserFollowStatus.UNFOLLOW) {
            throw new BadRequestException("Статус подписки должен быть FOLLOW или UNFOLLOW");
        }

        const followerExists = await this.prisma.followers.findUnique({ where: { id } });

        if (!followerExists) {
            throw new NotFoundException("Подписчик не найден");
        }

        if (followerExists.status !== UserFollowStatus.PENDING) {
            throw new BadRequestException("Запрос подписки уже обработан");
        }

        const updatedFollower = await this.prisma.followers.update({
            where: {
                id
            },
            data: {
                status
            }
        });

        if (!updatedFollower) {
            throw new InternalServerErrorException("Ошибка при обновлении статуса подписчика");
        }

        await this.notifyFollowerAboutDecision(updatedFollower as FollowerAnswerDTO).catch((error) => {
            console.log(error);
        });

        return updatedFollower as FollowerAnswerDTO;
    }
}
