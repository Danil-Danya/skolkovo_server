import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDTO {
    @ApiPropertyOptional({
        example: "123456789",
        description: "Telegram chat ID пользователя"
    })
    @IsOptional()
    @IsString()
    tgChatId?: string;

    @ApiPropertyOptional({
        example: "danil_snip",
        description: "Telegram username пользователя"
    })
    @IsOptional()
    @IsString()
    tgUserName?: string;

    @ApiPropertyOptional({
        example: "strong_password",
        description: "Пароль пользователя"
    })
    @IsOptional()
    @IsString()
    password?: string;
}

export class UpdateUserDTO {
    @ApiPropertyOptional({
        example: "123456789",
        description: "Telegram chat ID пользователя"
    })
    @IsOptional()
    @IsString()
    tgChatId?: string;

    @ApiPropertyOptional({
        example: "danil_snip",
        description: "Telegram username пользователя"
    })
    @IsOptional()
    @IsString()
    tgUserName?: string;

    @ApiPropertyOptional({
        example: "strong_password",
        description: "Пароль пользователя"
    })
    @IsOptional()
    @IsString()
    password?: string;
}

export class UserAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор пользователя"
    })
    @IsUUID("4")
    id: string;

    @ApiPropertyOptional({
        example: "123456789",
        description: "Telegram chat ID пользователя",
        nullable: true
    })
    @IsOptional()
    @IsString()
    tgChatId?: string | null;

    @ApiPropertyOptional({
        example: "danil_snip",
        description: "Telegram username пользователя",
        nullable: true
    })
    @IsOptional()
    @IsString()
    tgUserName?: string | null;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания пользователя"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления пользователя"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @ApiPropertyOptional({
        example: null,
        description: "Дата удаления пользователя",
        nullable: true
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deletedAt?: Date | null;
}

export class UserDTO {
    id: string;
    tgChatId?: string | null;
    tgUserName?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
