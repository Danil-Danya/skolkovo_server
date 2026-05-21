import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString, IsUUID } from "class-validator";

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

export class CreateProfileDTO {
    @ApiProperty()
    @IsUUID("4")
    userId: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    companyId?: string | null;

    @ApiPropertyOptional({
        type: [String],
        nullable: true,
        example: [
            "550e8400-e29b-41d4-a716-446655440000",
            "550e8400-e29b-41d4-a716-446655440001"
        ]
    })
    @IsOptional()
    @Transform(({ value }) => parseCompanyIds(value), { toClassOnly: true })
    @IsArray()
    @IsUUID("4", { each: true })
    companyIds?: string[] | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    positionId?: string | null;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    gender?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    biography?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    region?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    tgUser?: string | null;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    avatarPath?: string | null;
}

export class UpdateProfileDTO {
    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    companyId?: string | null;

    @ApiPropertyOptional({
        type: [String],
        nullable: true,
        example: [
            "550e8400-e29b-41d4-a716-446655440000",
            "550e8400-e29b-41d4-a716-446655440001"
        ]
    })
    @IsOptional()
    @Transform(({ value }) => parseCompanyIds(value), { toClassOnly: true })
    @IsArray()
    @IsUUID("4", { each: true })
    companyIds?: string[] | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    positionId?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    gender?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    biography?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    region?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tgUser?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarPath?: string | null;
}

export class CreateProfileWithAvatarDTO extends OmitType(CreateProfileDTO, ["avatarPath"] as const) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarPath?: string;

    @ApiPropertyOptional({
        type: "string",
        format: "binary"
    })
    @IsOptional()
    avatar?: string;
}

export class UpdateProfileWithAvatarDTO extends UpdateProfileDTO {
    @ApiPropertyOptional({
        type: "string",
        format: "binary"
    })
    @IsOptional()
    avatar?: string;
}

export class ProfileAnswerDTO {
    @ApiProperty()
    @IsUUID("4")
    id: string;

    @ApiProperty()
    @IsUUID("4")
    userId: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    companyId?: string | null;

    @ApiPropertyOptional({
        type: [String],
        example: [
            "550e8400-e29b-41d4-a716-446655440000",
            "550e8400-e29b-41d4-a716-446655440001"
        ]
    })
    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    companyIds?: string[];

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    positionId?: string | null;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    gender?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    biography?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    region?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    tgUser?: string | null;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    avatarPath?: string | null;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}

export class ProfileDTO {
    id: string;
    userId: string;
    companyId?: string | null;
    companyIds?: string[];
    positionId?: string | null;
    firstName: string;
    lastName: string;
    gender?: string | null;
    biography?: string | null;
    region?: string | null;
    tgUser?: string | null;
    phone: string;
    avatarPath?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
