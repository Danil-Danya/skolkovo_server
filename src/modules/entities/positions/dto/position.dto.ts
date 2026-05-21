import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID } from "class-validator";

const normalizeOptionalBoolean = (value: unknown): unknown => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value !== "string") {
        return value;
    }

    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue.length) {
        return undefined;
    }

    if (normalizedValue === "true") {
        return true;
    }

    if (normalizedValue === "false") {
        return false;
    }

    return value;
}

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
}

export class ImportPositionsFromFileDTO {
    @ApiProperty({
        type: "string",
        format: "binary",
        description: "Excel file with position name in the first column and description in the second column"
    })
    @IsOptional()
    file?: string;

    @ApiPropertyOptional({
        example: false,
        default: false,
        description: "Skip the first row in every sheet when the file contains headers"
    })
    @IsOptional()
    @Transform(({ value }) => normalizeOptionalBoolean(value), { toClassOnly: true })
    @IsBoolean()
    skipFirstRow?: boolean;
}

export class ImportPositionSkippedRowDTO {
    @ApiProperty({
        example: "XLS Worksheet",
        description: "Sheet name where the row was skipped"
    })
    @IsString()
    sheet: string;

    @ApiProperty({
        example: 4,
        description: "Row number inside the sheet"
    })
    @IsInt()
    row: number;

    @ApiPropertyOptional({
        example: "CEO",
        description: "Position name from the row when available"
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: "Position with the same name already exists",
        description: "Reason why the row was skipped"
    })
    @IsString()
    reason: string;
}

export class ImportPositionsResultDTO {
    @ApiProperty({
        example: "Imported 62 positions",
        description: "Import result summary"
    })
    @IsString()
    message: string;

    @ApiProperty({
        example: 64,
        description: "Number of non-empty rows processed from the file"
    })
    @IsInt()
    totalRows: number;

    @ApiProperty({
        example: 62,
        description: "Number of created positions"
    })
    @IsInt()
    createdCount: number;

    @ApiProperty({
        example: 2,
        description: "Number of skipped rows"
    })
    @IsInt()
    skippedCount: number;

    @ApiProperty({
        type: ImportPositionSkippedRowDTO,
        isArray: true,
        description: "Rows skipped during import"
    })
    skippedRows: ImportPositionSkippedRowDTO[];
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
}

export class PositionDTO {
    id: string;
    name: string;
    description: string;
}