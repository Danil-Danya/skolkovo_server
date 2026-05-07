import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePositionDTO {
    @ApiProperty({
        example: "Frontend developer",
        description: "Название должности"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "Разработчик пользовательских интерфейсов",
        description: "Описание должности"
    })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID категории должности",
        nullable: true
    })
    @IsOptional()
    @IsUUID("4")
    categoryId?: string | null;
}

export class UpdatePositionDTO {
    @ApiPropertyOptional({
        example: "Frontend developer",
        description: "Название должности"
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: "Разработчик пользовательских интерфейсов",
        description: "Описание должности"
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID категории должности",
        nullable: true
    })
    @IsOptional()
    @IsUUID("4")
    categoryId?: string | null;
}

export class PositionAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор должности"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "Frontend developer",
        description: "Название должности"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "Разработчик пользовательских интерфейсов",
        description: "Описание должности"
    })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "ID категории должности",
        nullable: true
    })
    @IsOptional()
    @IsUUID("4")
    categoryId?: string | null;
}

export class PositionDTO {
    id: string;
    name: string;
    description: string;
    categoryId?: string | null;
}