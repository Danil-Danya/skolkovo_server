import { Injectable } from "@nestjs/common";
import { Prisma, ReadNotificationStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import {
    CreateNotificationDto,
    CreateNotificationsForAnyUserDto,
    GetNotificationsDto,
    ReadNotificationsDto
} from "./dto/notification.dto";
import {
    createNotificationsForAllUsers as sendBotNotificationsForAllUsers,
    createNotificationsForCurrentUsers as sendBotNotificationsForCurrentUsers
} from "./integrations/bot/query_bot.notification";

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    private getNotificationData(dto: CreateNotificationDto | CreateNotificationsForAnyUserDto) {
        return {
            title: dto.title,
            text: dto.text,
            actionLinks: dto.actionLinks as Prisma.InputJsonValue | undefined
        };
    }

    private async rollbackNotification(id: string) {
        await this.prisma.notifications.delete({
            where: {
                id
            }
        }).catch(() => null);
    }

    private async sendBotNotificationsForUsers(userIds: string[], dto: CreateNotificationsForAnyUserDto) {
        const users = await this.prisma.users.findMany({
            where: {
                id: {
                    in: userIds
                },
                deletedAt: null,
                tgChatId: {
                    not: null
                }
            },
            select: {
                tgChatId: true
            }
        });

        const chatIds = users
            .map((user) => user.tgChatId?.trim() ?? "")
            .filter((chatId) => chatId.length > 0);

        if (chatIds.length === 0) {
            return;
        }

        await sendBotNotificationsForCurrentUsers({
            title: dto.title,
            message: dto.text,
            chatIds,
            actions: dto.actionLinks
        });
    }

    async createNotification(dto: CreateNotificationDto) {
        return this.prisma.notifications.create({
            data: this.getNotificationData(dto)
        });
    }

    async createNotificationsForAllUsers(dto: CreateNotificationDto) {
        const users = await this.prisma.users.findMany({
            select: {
                id: true
            }
        });

        const notification = await this.prisma.$transaction(async (tx) => {
            const notification = await tx.notifications.create({
                data: this.getNotificationData(dto)
            });

            if (users.length > 0) {
                await tx.read_notifications.createMany({
                    data: users.map((user) => {
                        return {
                            userId: user.id,
                            notificationId: notification.id,
                            status: ReadNotificationStatus.UNREAD
                        };
                    }),
                    skipDuplicates: true
                });
            }

            return notification;
        });

        try {
            await sendBotNotificationsForAllUsers({
                title: dto.title,
                message: dto.text,
                actions: dto.actionLinks
            });
        }
        catch (error) {
            await this.rollbackNotification(notification.id);
            throw error;
        }

        return notification;
    }

    async createNotificationsForAnyUser(dto: CreateNotificationsForAnyUserDto) {
        const notification = await this.prisma.$transaction(async (tx) => {
            const notification = await tx.notifications.create({
                data: this.getNotificationData(dto)
            });

            if (dto.userIds.length > 0) {
                await tx.read_notifications.createMany({
                    data: dto.userIds.map((userId) => {
                        return {
                            userId,
                            notificationId: notification.id,
                            status: ReadNotificationStatus.UNREAD
                        };
                    }),
                    skipDuplicates: true
                });
            }

            return notification;
        });

        try {
            await this.sendBotNotificationsForUsers(dto.userIds, dto);
        }
        catch (error) {
            await this.rollbackNotification(notification.id);
            throw error;
        }

        return notification;
    }

    async getNotifications(dto: GetNotificationsDto) {
        return this.prisma.read_notifications.findMany({
            where: {
                userId: dto.userId,
                status: dto.status as ReadNotificationStatus | undefined
            },
            include: {
                notification: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 100,
        });
    }

    async readNotifications(dto: ReadNotificationsDto) {
        return this.prisma.read_notifications.updateMany({
            where: {
                userId: dto.userId,
                notificationId: {
                    in: dto.notificationIds
                }
            },
            data: {
                status: ReadNotificationStatus.READ
            }
        });
    }
}
