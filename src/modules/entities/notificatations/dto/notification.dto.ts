import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested
} from "class-validator";
import { ReadNotificationStatus } from "@prisma/client";

export enum NotificationActionType {
    MINI_APP = "MINI_APP"
}

export class NotificationActionLinkDto {
    @ApiProperty({
        example: "Смотреть в приложении"
    })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({
        enum: NotificationActionType,
        example: NotificationActionType.MINI_APP
    })
    @IsEnum(NotificationActionType)
    type: NotificationActionType;

    @ApiPropertyOptional({
        example: "/news"
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    path?: string;
}

export class CreateNotificationDto {
    @ApiProperty({
        example: "Новое уведомление"
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: "Текст уведомления"
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        type: NotificationActionLinkDto,
        isArray: true
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NotificationActionLinkDto)
    actionLinks?: NotificationActionLinkDto[];
}

export class CreateNotificationsForAnyUserDto {
    @ApiProperty({
        example: "Новое уведомление"
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: "Текст уведомления"
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        type: NotificationActionLinkDto,
        isArray: true
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NotificationActionLinkDto)
    actionLinks?: NotificationActionLinkDto[];

    @ApiProperty({
        example: [
            "6f460144-088b-4b11-9063-ecbd77a6e44d",
            "7c942c17-1371-4532-9a98-4651925dfd78"
        ]
    })
    @IsArray()
    @IsUUID("4", { each: true })
    userIds: string[];
}

export class GetNotificationsDto {
    @ApiProperty({
        example: "6f460144-088b-4b11-9063-ecbd77a6e44d"
    })
    @IsUUID("4")
    userId: string;

    @ApiPropertyOptional({
        enum: ReadNotificationStatus,
        example: ReadNotificationStatus.UNREAD
    })
    @IsOptional()
    @IsEnum(ReadNotificationStatus)
    status?: ReadNotificationStatus;
}

export class ReadNotificationsDto {
    @ApiProperty({
        example: "6f460144-088b-4b11-9063-ecbd77a6e44d"
    })
    @IsUUID("4")
    userId: string;

    @ApiProperty({
        example: [
            "86d53dd0-f798-4e17-958f-3332cd0a8db4",
            "b6e76970-e229-4cb5-9e04-8df70c47cbf2"
        ]
    })
    @IsArray()
    @IsUUID("4", { each: true })
    notificationIds: string[];
}
