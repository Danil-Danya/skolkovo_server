import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { QueryDTO } from "src/core/dto/global.dto";

const parseJsonString = (value: unknown): unknown => {
    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    }
    catch {
        return value;
    }
}

const parseNullableUuid = (value: unknown): unknown => {
    if (value === undefined || value === null) {
        return value;
    }

    if (typeof value !== "string") {
        return value;
    }

    const normalizedValue = value.trim();

    if (!normalizedValue.length) {
        return null;
    }

    if (normalizedValue.toLowerCase() === "null") {
        return null;
    }

    return normalizedValue;
}

const parseNewsContent = (value: unknown): unknown => {
    const parsedValue = parseJsonString(value);

    if (!Array.isArray(parsedValue)) {
        return parsedValue;
    }

    return parsedValue.map((item) => plainToInstance(NewsContentDTO, item));
}

const parseCategoryIds = (value: unknown): string[] | undefined => {
    if (value === undefined || value === null) {
        return undefined;
    }

    if (Array.isArray(value)) {
        const parsedValues = value
            .flatMap((item) => parseCategoryIds(item) ?? [])
            .filter(Boolean);

        return parsedValues.length > 0 ? parsedValues : undefined;
    }

    if (typeof value !== "string") {
        return undefined;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return undefined;
    }

    try {
        const parsedValue = JSON.parse(trimmedValue);

        if (Array.isArray(parsedValue)) {
            const parsedCategories = parsedValue
                .map((item) => String(item).trim())
                .filter(Boolean);

            return parsedCategories.length > 0 ? parsedCategories : undefined;
        }
    }
    catch {}

    const normalizedValue = trimmedValue.startsWith("[") && trimmedValue.endsWith("]")
        ? trimmedValue.slice(1, -1)
        : trimmedValue;

    const parsedCategories = normalizedValue
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);

    return parsedCategories.length > 0 ? parsedCategories : undefined;
}

export class NewsContentDTO {
    @ApiPropertyOptional({
        example: "News block subtitle",
        description: "Optional subtitle for a content block"
    })
    @IsOptional()
    @IsString()
    subtitle?: string;

    @ApiPropertyOptional({
        example: "News block text",
        description: "Optional text for a content block"
    })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiPropertyOptional({
        example: ["First point", "Second point"],
        description: "Optional list for a content block"
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    list?: string[];

    @ApiPropertyOptional({
        example: "/static/news/content-image.webp",
        description: "Image path for a content block"
    })
    @IsOptional()
    @IsString()
    imagePath?: string;
}

export class CreateNewsDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News author id"
    })
    @IsUUID("4")
    authorId: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News category id",
        nullable: true
    })
    @IsOptional()
    @Transform(({ value }) => parseNullableUuid(value), { toClassOnly: true })
    @IsUUID("4")
    categoryId?: string | null;

    @ApiProperty({
        example: "News title",
        description: "News title"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "/static/news/preview.webp",
        description: "Preview image path"
    })
    @IsString()
    previewPath: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Block subtitle",
                text: "Block text",
                list: ["First point", "Second point"],
                imagePath: "/static/news/content-image.webp"
            }
        ],
        description: "News content blocks"
    })
    @Transform(({ value }) => parseNewsContent(value), { toClassOnly: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NewsContentDTO)
    content: NewsContentDTO[];

    @ApiPropertyOptional({
        example: 0,
        description: "Views counter"
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    views?: number;

    @ApiProperty({
        example: "Short description",
        description: "Short description"
    })
    @IsString()
    shortDescription: string;
}

export class CreateNewsWithFilesDTO extends OmitType(CreateNewsDTO, ["previewPath"] as const) {
    @ApiPropertyOptional({
        example: "/static/news/existing-preview.webp",
        description: "Existing preview image path"
    })
    @IsOptional()
    @IsString()
    previewPath?: string;
}

export class UpdateNewsDTO {
    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News author id"
    })
    @IsOptional()
    @IsUUID("4")
    authorId?: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News category id",
        nullable: true
    })
    @IsOptional()
    @Transform(({ value }) => parseNullableUuid(value), { toClassOnly: true })
    @IsUUID("4")
    categoryId?: string | null;

    @ApiPropertyOptional({
        example: "Updated news title",
        description: "News title"
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: "/static/news/preview.webp",
        description: "Preview image path"
    })
    @IsOptional()
    @IsString()
    previewPath?: string;

    @ApiPropertyOptional({
        example: [
            {
                subtitle: "Block subtitle",
                text: "Block text",
                list: ["First point", "Second point"],
                imagePath: "/static/news/content-image.webp"
            }
        ],
        description: "News content blocks"
    })
    @IsOptional()
    @Transform(({ value }) => parseNewsContent(value), { toClassOnly: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NewsContentDTO)
    content?: NewsContentDTO[];

    @ApiPropertyOptional({
        example: 0,
        description: "Views counter"
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    views?: number;

    @ApiPropertyOptional({
        example: "Short description",
        description: "Short description"
    })
    @IsOptional()
    @IsString()
    shortDescription?: string;
}

export class NewsAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News id"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News author id"
    })
    @IsOptional()
    @IsUUID("4")
    authorId?: string | null;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News category id",
        nullable: true
    })
    @IsOptional()
    @IsUUID("4")
    categoryId?: string | null;

    @ApiProperty({
        example: "News title",
        description: "News title"
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "/static/news/preview.webp",
        description: "Preview image path"
    })
    @IsString()
    previewPath: string;

    @ApiProperty({
        example: [
            {
                subtitle: "Block subtitle",
                text: "Block text",
                list: ["First point", "Second point"],
                imagePath: "/static/news/content-image.webp"
            }
        ],
        description: "News content blocks"
    })
    content: NewsContentDTO[];

    @ApiProperty({
        example: 0,
        description: "Views counter"
    })
    @IsInt()
    views: number;

    @ApiProperty({
        example: "Short description",
        description: "Short description"
    })
    @IsString()
    shortDescription: string;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Created at"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Updated at"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class NewsDTO {
    id: string;
    authorId?: string | null;
    categoryId?: string | null;
    title: string;
    previewPath: string;
    content: NewsContentDTO[];
    views: number;
    shortDescription: string;
    createdAt: Date;
    updatedAt: Date;
}

export class NewsQueryDTO extends QueryDTO {
    @ApiPropertyOptional({
        type: String,
        example: "[550e8400-e29b-41d4-a716-446655440000, 660e8400-e29b-41d4-a716-446655440000]",
        description: "Filter news by category ids"
    })
    @IsOptional()
    @Transform(({ value }) => parseCategoryIds(value))
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiPropertyOptional({
        type: String,
        example: "[550e8400-e29b-41d4-a716-446655440000, 660e8400-e29b-41d4-a716-446655440000]",
        description: "Alias for categories query parameter"
    })
    @IsOptional()
    @Transform(({ value }) => parseCategoryIds(value))
    @IsArray()
    @IsString({ each: true })
    categorirs?: string[];
}
