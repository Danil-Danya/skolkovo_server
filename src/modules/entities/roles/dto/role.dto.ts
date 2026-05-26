import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateRoleDTO {
    @ApiProperty({
        example: "admin",
        description: "Название роли"
    })
    @IsString()
    name: string;
}

export class UpdateRoleDTO {
    @ApiPropertyOptional({
        example: "manager",
        description: "Название роли"
    })
    @IsOptional()
    @IsString()
    name?: string;
}

export class RoleAnswerDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Идентификатор роли"
    })
    @IsUUID("4")
    id: string;

    @ApiProperty({
        example: "admin",
        description: "Название роли"
    })
    @IsString()
    name: string;
}

export class RoleDTO {
    id: string;
    name: string;
}