import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EventRegistrationStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsUUID } from "class-validator";

export class CreateEventRegistrationDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID пользователя"
    })
    @IsUUID("4")
    userId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID события"
    })
    @IsUUID("4")
    eventId: string;
}

export class ChangeEventRegistrationStatusDTO {
    @ApiProperty({
        example: EventRegistrationStatus.APPROVED,
        enum: EventRegistrationStatus,
        description: "Статус регистрации"
    })
    @IsEnum(EventRegistrationStatus)
    status: EventRegistrationStatus;
}

export class EventRegistrationAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор регистрации"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID пользователя"
    })
    @IsUUID("4")
    userId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID события"
    })
    @IsUUID("4")
    eventId: string;

    @ApiProperty({
        example: EventRegistrationStatus.PENDING,
        enum: EventRegistrationStatus,
        description: "Статус регистрации"
    })
    @IsEnum(EventRegistrationStatus)
    status: EventRegistrationStatus;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания регистрации"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления регистрации"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class EventRegistrationDTO {
    id: string;
    userId: string;
    eventId: string;
    status: EventRegistrationStatus;
    createdAt: Date;
    updatedAt: Date;
}