import { Injectable } from "@nestjs/common";
import { ReadNotificationStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import {
    CreateNotificationDto,
    CreateNotificationsForAnyUserDto,
    GetNotificationsDto,
    ReadNotificationsDto
} from "./dto/notification.dto";

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async createNotification(dto: CreateNotificationDto) {
        return this.prisma.notifications.create({
            data: {
                title: dto.title,
                text: dto.text
            }
        });
    }

    async createNotificationsForAllUsers(dto: CreateNotificationDto) {
        const users = await this.prisma.users.findMany({
            select: {
                id: true
            }
        });

        return this.prisma.$transaction(async (tx) => {
            const notification = await tx.notifications.create({
                data: {
                    title: dto.title,
                    text: dto.text
                }
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
    }

    async createNotificationsForAnyUser(dto: CreateNotificationsForAnyUserDto) {
        return this.prisma.$transaction(async (tx) => {
            const notification = await tx.notifications.create({
                data: {
                    title: dto.title,
                    text: dto.text
                }
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