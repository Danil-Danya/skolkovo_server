import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class EventDescriptionDTO {
    @ApiPropertyOptional({
        example: "Подзаголовок мероприятия",
        description: "Подзаголовок блока"
    })
    @IsOptional()
    @IsString()
    subtitle?: string;

    @ApiPropertyOptional({
        example: "Описание мероприятия",
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
        example: "/uploads/events/image.jpg",
        description: "Путь к изображению блока"
    })
    @IsOptional()
    @IsString()
    imagePath?: string;
}

export class CreateEventDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора мероприятия"
    })
    @IsUUID("4")
    authorId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID локации мероприятия"
    })
    @IsUUID("4")
    locationId: string;

    @ApiProperty({
        example: "Название мероприятия",
        description: "Название мероприятия"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Подзаголовок мероприятия",
                text: "Описание мероприятия",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/events/image.jpg"
            }
        ],
        description: "Описание мероприятия"
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventDescriptionDTO)
    description: EventDescriptionDTO[];

    @ApiProperty({
        example: 100,
        description: "Максимальное количество мест"
    })
    @IsInt()
    maxUnits: number;

    @ApiProperty({
        example: "active",
        description: "Статус мероприятия"
    })
    @IsString()
    status: string;

    @ApiPropertyOptional({
        example: 0,
        description: "Количество просмотров"
    })
    @IsOptional()
    @IsNumber()
    views: number;

    @ApiPropertyOptional({
        example: 100000,
        description: "Цена мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    price?: number | null;

    @ApiPropertyOptional({
        example: 10,
        description: "Скидка мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    discount?: number | null;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата начала мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({
        example: "2026-04-29T14:00:00.000Z",
        description: "Дата окончания мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    endTime: Date;
}

export class UpdateEventDTO {
    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора мероприятия"
    })
    @IsOptional()
    @IsUUID("4")
    authorId?: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID локации мероприятия"
    })
    @IsOptional()
    @IsUUID("4")
    locationId?: string;

    @ApiPropertyOptional({
        example: "Название мероприятия",
        description: "Название мероприятия"
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: [
            {
                subtitle: "Подзаголовок мероприятия",
                text: "Описание мероприятия",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/events/image.jpg"
            }
        ],
        description: "Описание мероприятия"
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventDescriptionDTO)
    description?: EventDescriptionDTO[];

    @ApiPropertyOptional({
        example: 100,
        description: "Максимальное количество мест"
    })
    @IsOptional()
    @IsInt()
    maxUnits?: number;

    @ApiPropertyOptional({
        example: "active",
        description: "Статус мероприятия"
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({
        example: "0",
        description: "Количество просмотров"
    })
    @IsOptional()
    @IsNumber()
    views: number;

    @ApiPropertyOptional({
        example: 100000,
        description: "Цена мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    price?: number | null;

    @ApiPropertyOptional({
        example: 10,
        description: "Скидка мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    discount?: number | null;

    @ApiPropertyOptional({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата начала мероприятия"
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startTime?: Date;

    @ApiPropertyOptional({
        example: "2026-04-29T14:00:00.000Z",
        description: "Дата окончания мероприятия"
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endTime?: Date;
}

export class EventAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор мероприятия"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID автора мероприятия"
    })
    @IsUUID("4")
    authorId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID локации мероприятия"
    })
    @IsUUID("4")
    locationId: string;

    @ApiProperty({
        example: "Название мероприятия",
        description: "Название мероприятия"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Подзаголовок мероприятия",
                text: "Описание мероприятия",
                list: ["Первый пункт", "Второй пункт"],
                imagePath: "/uploads/events/image.jpg"
            }
        ],
        description: "Описание мероприятия"
    })
    description: EventDescriptionDTO[];

    @ApiProperty({
        example: 100,
        description: "Максимальное количество мест"
    })
    @IsInt()
    maxUnits: number;

    @ApiProperty({
        example: "active",
        description: "Статус мероприятия"
    })
    @IsString()
    status: string;

    @ApiProperty({
        example: "0",
        description: "Количество просмотров"
    })
    @IsNumber()
    views: number;

    @ApiPropertyOptional({
        example: 100000,
        description: "Цена мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    price?: number | null;

    @ApiPropertyOptional({
        example: 10,
        description: "Скидка мероприятия",
        nullable: true
    })
    @IsOptional()
    @IsInt()
    discount?: number | null;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата начала мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({
        example: "2026-04-29T14:00:00.000Z",
        description: "Дата окончания мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    endTime: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления мероприятия"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class EventDTO {
    id: string;
    authorId: string;
    locationId: string;
    title: string;
    description: EventDescriptionDTO[];
    maxUnits: number;
    status: string;
    views: number;
    price?: number | null;
    discount?: number | null;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
    updatedAt: Date;
}