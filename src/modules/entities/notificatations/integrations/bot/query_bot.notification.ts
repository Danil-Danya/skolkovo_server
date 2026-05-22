import { BadGatewayException } from "@nestjs/common";
import api from "./client_bot.notification";
import type {
    BotFollowerRequestDto,
    BotNotificationDto,
    BotNotificationsByChatIdsDto
} from "../dto/notification.dto";

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Ошибка при отправке уведомления";
};

export const createNotificationsForAllUsers = async (notification: BotNotificationDto) => {
    try {
        const response = await api.post("/notifications/all", notification);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new BadGatewayException(getErrorMessage(error));
    }
};

export const createNotificationsForCurrentUsers = async (notification: BotNotificationsByChatIdsDto) => {
    try {
        const response = await api.post("/notifications/list", notification);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new BadGatewayException(getErrorMessage(error));
    }
};

export const createFollowerRequestNotification = async (notification: BotFollowerRequestDto) => {
    try {
        const response = await api.post("/notifications/follow-request", notification);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new BadGatewayException(getErrorMessage(error));
    }
};
