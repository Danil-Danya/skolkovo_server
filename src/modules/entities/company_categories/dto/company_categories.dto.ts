import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

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

const parseCompanyIds = (value: unknown): unknown => {
    const parsedValue = parseJsonString(value);

    if (parsedValue === undefined || parsedValue === null) {
        return parsedValue;
    }

    if (Array.isArray(parsedValue)) {
        return parsedValue;
    }

    if (typeof parsedValue !== "string") {
        return parsedValue;
    }

    const normalizedValue = parsedValue.trim();

    if (!normalizedValue) {
        return [];
    }

    return normalizedValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export class CreateCompanyCategoryDTO {
    @ApiProperty({
        example: "Генеральный подрядчик",
        description: "Название категории компании"
    })
    @IsString({
        message: "Название категории компании должно быть строкой"
    })
    name: string;

    @ApiProperty({
        example: "Компании, выполняющие полный цикл строительных работ и управление подрядчиками",
        description: "Описание категории компании"
    })
    @IsString({
        message: "Описание категории компании должно быть строкой"
    })
    description: string;

    @ApiPropertyOptional({
        type: [String],
        nullable: true,
        example: [
            "550e8400-e29b-41d4-a716-446655440000",
            "550e8400-e29b-41d4-a716-446655440001"
        ],
        description: "Компании, которые нужно привязать к категории"
    })
    @IsOptional()
    @Transform(({ value }) => parseCompanyIds(value), { toClassOnly: true })
    @IsArray()
    @IsUUID("4", { each: true, message: "Каждая компания должна иметь корректный UUID" })
    companyIds?: string[] | null;
}

export class UpdateCompanyCategoryDTO {
    @ApiPropertyOptional({
        example: "Проектная организация",
        description: "Название категории компании"
    })
    @IsOptional()
    @IsString({
        message: "Название категории компании должно быть строкой"
    })
    name?: string;

    @ApiPropertyOptional({
        example: "Компании, занимающиеся архитектурным и инженерным проектированием строительных объектов",
        description: "Описание категории компании"
    })
    @IsOptional()
    @IsString({
        message: "Описание категории компании должно быть строкой"
    })
    description?: string;

    @ApiPropertyOptional({
        type: [String],
        nullable: true,
        example: [
            "550e8400-e29b-41d4-a716-446655440000",
            "550e8400-e29b-41d4-a716-446655440001"
        ],
        description: "Новый список компаний категории"
    })
    @IsOptional()
    @Transform(({ value }) => parseCompanyIds(value), { toClassOnly: true })
    @IsArray()
    @IsUUID("4", { each: true, message: "Каждая компания должна иметь корректный UUID" })
    companyIds?: string[] | null;
}

export class CompanyCategoryAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID категории компании"
    })
    @IsUUID("4", {
        message: "ID категории компании должен быть корректным UUID"
    })
    id: string;

    @ApiProperty({
        example: "Поставщик строительных материалов",
        description: "Название категории компании"
    })
    @IsString({
        message: "Название категории компании должно быть строкой"
    })
    name: string;

    @ApiProperty({
        example: "Компании, поставляющие бетон, металлоконструкции, отделочные материалы и другое строительное сырье",
        description: "Описание категории компании"
    })
    @IsString({
        message: "Описание категории компании должно быть строкой"
    })
    description: string;
}

export class CompanyCategoryDTO {
    id: string;
    name: string;
    description: string;
}
