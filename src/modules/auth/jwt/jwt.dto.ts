import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class LoginFromTelegramDTO {
    @ApiProperty({
        example: "encrypted_telegram_payload",
        description: "Зашифрованная строка авторизации Telegram"
    })
    @IsString()
    auth: string;
}

export class AdminLoginDTO {
    @ApiProperty({
        example: "danil_sabitov",
        description: "Telegram username"
    })
    @IsString()
    tgUserName: string;

    @ApiProperty({
        example: "strong_password",
        description: "Пароль пользователя"
    })
    @IsString()
    password: string;
}

export class TokenDTO {
    @ApiProperty({
        example: "jwt_token",
        description: "JWT токен"
    })
    @IsString()
    token: string;

    @ApiProperty({
        example: 1746100000,
        description: "Unix timestamp времени истечения токена"
    })
    expiriesAt: number;
}

export class TokenAnswerDTO {
    @ApiProperty({ type: TokenDTO })
    accessToken: TokenDTO;

    @ApiProperty({ type: TokenDTO })
    refreshToken: TokenDTO;
}

export class JWTUserPayloadDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор пользователя"
    })
    @IsUUID("4")
    id: string;
}

export class JWTAccessPayloadDTO extends JWTUserPayloadDTO {
    @ApiProperty({
        example: "access",
        description: "Тип access токена"
    })
    @IsString()
    tokenType: string;
}

export class RefreshPayloadDTO extends JWTUserPayloadDTO {
    @ApiProperty({
        example: "refresh",
        description: "Тип refresh токена"
    })
    @IsString()
    tokenType: string;
}

export class RefreshRequestUserDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор пользователя"
    })
    @IsUUID("4")
    id: string;
}

export class TelegramBotRegisterDTO {
    @ApiProperty({
        example: "123456789",
        description: "Telegram chat id"
    })
    @IsString()
    chatId: string;

    @ApiPropertyOptional({
        example: "danil_sabitov",
        description: "Telegram username"
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        example: "Данил",
        description: "Имя пользователя"
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        example: "Сабитов",
        description: "Фамилия пользователя"
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        example: "+998338709909",
        description: "Телефон пользователя"
    })
    @IsString()
    phone: string;
}

export class TelegramBotRegisterAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор пользователя"
    })
    @IsUUID("4")
    userId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "Идентификатор профиля"
    })
    @IsUUID("4")
    profileId: string;

    @ApiProperty({
        example: "123456789",
        description: "Telegram chat id"
    })
    @IsString()
    chatId: string;

    @ApiPropertyOptional({
        example: "danil_sabitov",
        description: "Telegram username",
        nullable: true
    })
    @IsOptional()
    @IsString()
    username?: string | null;

    @ApiProperty({
        example: "Данил",
        description: "Имя пользователя"
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        example: "Сабитов",
        description: "Фамилия пользователя"
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        example: "+998338709909",
        description: "Телефон пользователя"
    })
    @IsString()
    phone: string;

    @ApiProperty({
        example: true,
        description: "Был ли создан новый пользователь"
    })
    @IsBoolean()
    isNewUser: boolean;

    @ApiProperty({
        example: true,
        description: "Был ли создан новый профиль"
    })
    @IsBoolean()
    isNewProfile: boolean;
}
