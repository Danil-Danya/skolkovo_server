import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLocationDTO {
    @ApiProperty({
        example: "Парк",
        description: "Название локации"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "41.2995",
        description: "Широта"
    })
    @IsString()
    lat: string;

    @ApiProperty({
        example: "69.2401",
        description: "Долгота"
    })
    @IsString()
    long: string;

    @ApiProperty({
        example: "Ташкент, улица Амира Темура",
        description: "Адрес локации"
    })
    @IsString()
    address: string;

    @ApiProperty({
        example: "https://yandex.uz/maps/-/example",
        description: "Ссылка на Яндекс карты"
    })
    @IsString()
    yandexLink: string;
}

export class UpdateLocationDTO {
    @ApiPropertyOptional({
        example: "Парк",
        description: "Название локации"
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: "41.2995",
        description: "Широта"
    })
    @IsOptional()
    @IsString()
    lat?: string;

    @ApiPropertyOptional({
        example: "69.2401",
        description: "Долгота"
    })
    @IsOptional()
    @IsString()
    long?: string;

    @ApiPropertyOptional({
        example: "Ташкент, улица Амира Темура",
        description: "Адрес локации"
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        example: "https://yandex.uz/maps/-/example",
        description: "Ссылка на Яндекс карты"
    })
    @IsOptional()
    @IsString()
    yandexLink?: string;
}

export class LocationAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор локации"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "Парк",
        description: "Название локации"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "41.2995",
        description: "Широта"
    })
    @IsString()
    lat: string;

    @ApiProperty({
        example: "69.2401",
        description: "Долгота"
    })
    @IsString()
    long: string;

    @ApiProperty({
        example: "Ташкент, улица Амира Темура",
        description: "Адрес локации"
    })
    @IsString()
    address: string;

    @ApiProperty({
        example: "https://yandex.uz/maps/-/example",
        description: "Ссылка на Яндекс карты"
    })
    @IsString()
    yandexLink: string;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания локации"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления локации"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class LocationDTO {
    id: string;
    name: string;
    lat: string;
    long: string;
    address: string;
    yandexLink: string;
    createdAt: Date;
    updatedAt: Date;
}