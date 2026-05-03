import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class NewsContentDTO {
    @ApiPropertyOptional({
        example: "Подзаголовок статьи",
        description: "Подзаголовок блока"
    })
    @IsOptional()
    @IsString()
    subtitle?: string;

    @ApiPropertyOptional({
        example: "Текст статьи",
        description: "Текст блока"
    })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiPropertyOptional({
        example: ["Первый пункт", "Второй пункт"],
        description: "Список блока"
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    list?: string[];

    @ApiPropertyOptional({
        example: "/uploads/news/content-image.jpg",
        description: "Путь к изображению блока"
    })
    @IsOptional()
    @IsString()
    imagePath?: string;
}

export class CreateNewsDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора новости"
    })
    @IsUUID("4")
    authorId: string;

    @ApiProperty({
        example: "Заголовок новости",
        description: "Название новости"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "/uploads/news/preview.jpg",
        description: "Путь к превью изображению"
    })
    @IsString()
    previewPath: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Подзаголовок статьи",
                text: "Текст статьи",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/news/content-image.jpg"
            }
        ],
        description: "Контент новости"
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NewsContentDTO)
    content: NewsContentDTO[];

    @ApiPropertyOptional({
        example: 0,
        description: "Количество просмотров"
    })
    @IsOptional()
    @IsInt()
    views?: number;

    @ApiProperty({
        example: "Краткое описание новости",
        description: "Короткое описание"
    })
    @IsString()
    shortDescription: string;
}

export class UpdateNewsDTO {
    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора новости"
    })
    @IsOptional()
    @IsUUID("4")
    authorId?: string;

    @ApiPropertyOptional({
        example: "Заголовок новости",
        description: "Название новости"
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: "/uploads/news/preview.jpg",
        description: "Путь к превью изображению"
    })
    @IsOptional()
    @IsString()
    previewPath?: string;

    @ApiPropertyOptional({
        example: [
            {
                subtitle: "Подзаголовок статьи",
                text: "Текст статьи",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/news/content-image.jpg"
            }
        ],
        description: "Контент новости"
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NewsContentDTO)
    content?: NewsContentDTO[];

    @ApiPropertyOptional({
        example: 0,
        description: "Количество просмотров"
    })
    @IsOptional()
    @IsInt()
    views?: number;

    @ApiPropertyOptional({
        example: "Краткое описание новости",
        description: "Короткое описание"
    })
    @IsOptional()
    @IsString()
    shortDescription?: string;
}

export class NewsAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор новости"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора новости"
    })
    @IsUUID("4")
    authorId: string;

    @ApiProperty({
        example: "Заголовок новости",
        description: "Название новости"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "/uploads/news/preview.jpg",
        description: "Путь к превью изображению"
    })
    @IsString()
    previewPath: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Подзаголовок статьи",
                text: "Текст статьи",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/news/content-image.jpg"
            }
        ],
        description: "Контент новости"
    })
    content: NewsContentDTO[];

    @ApiProperty({
        example: 0,
        description: "Количество просмотров"
    })
    @IsInt()
    views: number;

    @ApiProperty({
        example: "Краткое описание новости",
        description: "Короткое описание"
    })
    @IsString()
    shortDescription: string;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания новости"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления новости"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class NewsDTO {
    id: string;
    authorId: string;
    title: string;
    previewPath: string;
    content: NewsContentDTO[];
    views: number;
    shortDescription: string;
    createdAt: Date;
    updatedAt: Date;
}