import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import {
    CreateNotificationDto,
    CreateNotificationsForAnyUserDto,
    GetNotificationsDto,
    ReadNotificationsDto
} from "./dto/notification.dto";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать уведомление" })
    @ApiBody({ type: CreateNotificationDto })
    @Post()
    private async createNotification(@Body() dto: CreateNotificationDto) {
        const notification = await this.notificationService.createNotification(dto);
        return notification;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать уведомление для всех пользователей" })
    @ApiBody({ type: CreateNotificationDto })
    @Post("all-users")
    private async createNotificationsForAllUsers(@Body() dto: CreateNotificationDto) {
        const notification = await this.notificationService.createNotificationsForAllUsers(dto);
        return notification;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать уведомление для выбранных пользователей" })
    @ApiBody({ type: CreateNotificationsForAnyUserDto })
    @Post("users")
    private async createNotificationsForAnyUser(@Body() dto: CreateNotificationsForAnyUserDto) {
        const notification = await this.notificationService.createNotificationsForAnyUser(dto);
        return notification;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить уведомления пользователя" })
    @Get()
    private async getNotifications(@Query() dto: GetNotificationsDto) {
        const notifications = await this.notificationService.getNotifications(dto);
        return notifications;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Прочитать уведомления" })
    @ApiBody({ type: ReadNotificationsDto })
    @Patch("read")
    private async readNotifications(@Body() dto: ReadNotificationsDto) {
        const result = await this.notificationService.readNotifications(dto);
        return result;
    }
}