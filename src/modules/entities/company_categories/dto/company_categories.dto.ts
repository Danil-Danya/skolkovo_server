import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

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