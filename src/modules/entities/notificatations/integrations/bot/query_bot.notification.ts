import { BadGatewayException } from "@nestjs/common";
import api from "./client_bot.notification";

export const createNotificationsForAllUsers = async (notification) => {
    try {

    }
    catch (error) {
        console.log(error);
        throw new BadGatewayException("Ошибка при отправке уведомления");
    }
}

export const createNotificationsForCurrentUsers = async (notification) => {
    try {

    }
    catch (error) {
        console.log(error);
        throw new BadGatewayException("Ошибка при отправке уведомления");
    }
}