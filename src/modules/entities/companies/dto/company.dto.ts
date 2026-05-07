import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCompanyDTO {
    @ApiProperty({
        example: "ООО Ромашка",
        description: "Название компании"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "123456789",
        description: "ИНН компании"
    })
    @IsString()
    inn: string;

    @ApiProperty({
        example: "Описание компании",
        description: "Описание компании"
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: "+998901234567",
        description: "Телефон компании"
    })
    @IsString()
    phone: string;

    @ApiProperty({
        example: "https://company.uz",
        description: "Сайт компании"
    })
    @IsString()
    site: string;

    @ApiProperty({
        example: "/static/companies/preview.webp",
        description: "Путь к превью компании"
    })
    @IsString()
    previewPath: string;

    @ApiPropertyOptional({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата регистрации компании",
        nullable: true
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    registeredAt?: Date | null;
}

export class CreateCompanyWithPreviewDTO extends OmitType(CreateCompanyDTO, ["previewPath"] as const) {
    @ApiPropertyOptional({
        example: "/static/companies/existing-preview.webp",
        description: "Путь к уже существующему превью"
    })
    @IsOptional()
    @IsString()
    previewPath?: string;

    @ApiPropertyOptional({
        type: "string",
        format: "binary"
    })
    @IsOptional()
    preview?: string;
}

export class UpdateCompanyDTO {
    @ApiPropertyOptional({
        example: "ООО Ромашка",
        description: "Название компании"
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: "123456789",
        description: "ИНН компании"
    })
    @IsOptional()
    @IsString()
    inn?: string;

    @ApiPropertyOptional({
        example: "Описание компании",
        description: "Описание компании"
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: "+998901234567",
        description: "Телефон компании"
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({
        example: "https://company.uz",
        description: "Сайт компании"
    })
    @IsOptional()
    @IsString()
    site?: string;

    @ApiPropertyOptional({
        example: "/static/companies/preview.webp",
        description: "Путь к превью компании"
    })
    @IsOptional()
    @IsString()
    previewPath?: string;

    @ApiPropertyOptional({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата регистрации компании",
        nullable: true
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    registeredAt?: Date | null;
}

export class UpdateCompanyWithPreviewDTO extends UpdateCompanyDTO {
    @ApiPropertyOptional({
        type: "string",
        format: "binary"
    })
    @IsOptional()
    preview?: string;
}

export class CompanyAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор компании"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "ООО Ромашка",
        description: "Название компании"
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "123456789",
        description: "ИНН компании"
    })
    @IsString()
    inn: string;

    @ApiProperty({
        example: "Описание компании",
        description: "Описание компании"
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: "+998901234567",
        description: "Телефон компании"
    })
    @IsString()
    phone: string;

    @ApiProperty({
        example: "https://company.uz",
        description: "Сайт компании"
    })
    @IsString()
    site: string;

    @ApiProperty({
        example: "/static/companies/preview.webp",
        description: "Путь к превью компании"
    })
    @IsString()
    previewPath: string;

    @ApiPropertyOptional({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата регистрации компании",
        nullable: true
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    registeredAt?: Date | null;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата создания компании"
    })
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: "2026-04-29T12:00:00.000Z",
        description: "Дата обновления компании"
    })
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class CompanyDTO {
    id: string;
    name: string;
    inn: string;
    description: string;
    phone: string;
    site: string;
    previewPath: string;
    registeredAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
