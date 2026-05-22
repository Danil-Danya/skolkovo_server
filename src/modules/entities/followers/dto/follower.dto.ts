import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsIn, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export enum UserFollowStatus {
    PENDING = "PENDING",
    FOLLOW = "FOLLOW",
    UNFOLLOW = "UNFOLLOW"
}

export class CreateFollowerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID пользователя, который подписывается"
    })
    @IsUUID("4", {
        message: "ID подписчика должен быть корректным UUID"
    })
    followerId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "ID пользователя, на которого подписываются"
    })
    @IsUUID("4", {
        message: "ID пользователя, на которого подписываются, должен быть корректным UUID"
    })
    followingId: string;
}

export class UpdateFollowerStatusDTO {
    @ApiProperty({
        example: UserFollowStatus.FOLLOW,
        enum: UserFollowStatus,
        description: "Статус подписки пользователя"
    })
    @IsEnum(UserFollowStatus, {
        message: "Статус подписки должен быть FOLLOW или UNFOLLOW"
    })
    status: UserFollowStatus;
}

export class FollowerAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID записи подписки"
    })
    @IsUUID("4", {
        message: "ID подписки должен быть корректным UUID"
    })
    id: string;

    @ApiProperty({
        example: UserFollowStatus.FOLLOW,
        enum: UserFollowStatus,
        description: "Статус подписки пользователя"
    })
    @IsEnum(UserFollowStatus, {
        message: "Статус подписки должен быть FOLLOW или UNFOLLOW"
    })
    status: UserFollowStatus;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID пользователя, который подписался"
    })
    @IsUUID("4", {
        message: "ID подписчика должен быть корректным UUID"
    })
    followerId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "ID пользователя, на которого подписались"
    })
    @IsUUID("4", {
        message: "ID пользователя, на которого подписались, должен быть корректным UUID"
    })
    followingId: string;

    @ApiProperty({
        example: "2026-05-18T12:00:00.000Z",
        description: "Дата создания подписки"
    })
    @Type(() => Date)
    @IsDate({
        message: "Дата создания подписки должна быть корректной датой"
    })
    createdAt: Date;
}

export class FollowerBotDecisionDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID записи подписки"
    })
    @IsUUID("4", {
        message: "ID подписки должен быть корректным UUID"
    })
    id: string;

    @ApiProperty({
        example: UserFollowStatus.FOLLOW,
        enum: [UserFollowStatus.FOLLOW, UserFollowStatus.UNFOLLOW],
        description: "Решение по запросу подписки"
    })
    @IsIn([UserFollowStatus.FOLLOW, UserFollowStatus.UNFOLLOW], {
        message: "Статус подписки должен быть FOLLOW или UNFOLLOW"
    })
    status: UserFollowStatus;
}

export class FollowerDTO {
    id: string;
    status: UserFollowStatus;
    followerId: string;
    followingId: string;
    createdAt: Date;
}
