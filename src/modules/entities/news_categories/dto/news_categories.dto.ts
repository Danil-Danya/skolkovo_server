import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateNewsCategoryDTO {
    @ApiProperty({
        example: "Category name",
        description: "News category name"
    })
    @IsString()
    name: string;
}

export class UpdateNewsCategoryDTO {
    @ApiPropertyOptional({
        example: "Updated category name",
        description: "News category name"
    })
    @IsOptional()
    @IsString()
    name?: string;
}

export class NewsCategoryAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "News category id"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "Category name",
        description: "News category name"
    })
    @IsString()
    name: string;
}

export class NewsCategoryDTO {
    id: string;
    name: string;
}