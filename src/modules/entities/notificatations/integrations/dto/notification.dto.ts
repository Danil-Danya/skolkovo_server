import type { NotificationActionLinkDto } from "../../dto/notification.dto";

export interface BotNotificationDto {
    title: string;
    message: string;
    actions?: NotificationActionLinkDto[];
}

export interface BotNotificationsByChatIdsDto extends BotNotificationDto {
    chatIds: string[];
}

export interface BotFollowerRequestDto {
    chatId: string;
    requestId: string;
    followerId: string;
    followingId: string;
    followerName: string;
    followerUserName?: string | null;
}
