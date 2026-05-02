import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProfileDTO {
    @ApiProperty()
    @IsUUID("4")
    userId: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    companyId?: string | null;

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

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString()
    biography: string;

    @ApiProperty()
    @IsString()
    region: string;

    @ApiProperty()
    @IsString()
    tgUser: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    avatarPath: string;
}

export class UpdateProfileDTO {
    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUUID("4")
    companyId?: string | null;

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
    gender?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    biography?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    region?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tgUser?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarPath?: string;
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

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString()
    biography: string;

    @ApiProperty()
    @IsString()
    region: string;

    @ApiProperty()
    @IsString()
    tgUser: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    avatarPath: string;

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
    positionId?: string | null;
    firstName: string;
    lastName: string;
    gender: string;
    biography: string;
    region: string;
    tgUser: string;
    phone: string;
    avatarPath: string;
    createdAt: Date;
    updatedAt: Date;
}
