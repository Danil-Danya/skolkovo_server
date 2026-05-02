import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class DeletedMessageDTO {
    @ApiProperty({
        example: "Пользователь был успешно удален",
        description: "Сообщение о результате удаления"
    })
    @IsString({ message: "message должен быть строкой" })
    message: string;
}

export class FiltersDTO {
    @IsOptional()
    @IsString({ message: "where должен быть строкой" })
    where?: string;

    @IsOptional()
    @IsString({ message: "whereField должен быть строкой" })
    whereField?: string;

    @IsOptional()
    @IsString({ message: "search должен быть строкой" })
    search?: string;

    @IsOptional()
    @IsString({ message: "searchField должен быть строкой" })
    searchField?: string;

    @IsOptional()
    @IsIn(["asc", "desc"], { message: "order должен быть asc или desc" })
    order?: string;

    @IsOptional()
    @IsString({ message: "orderBy должен быть строкой" })
    orderBy?: string;
}

export class PaginateDTO {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Страница всегда число" })
    @Min(1, { message: "Страница не может быть меньше 1" })
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Лимит всегда число" })
    @Min(1, { message: "Лимит не может быть меньше 1" })
    limit?: number;
}

export class QueryDTO {
    @ApiPropertyOptional({
        example: "user@mail.com",
        description: "Значение точного фильтра"
    })
    @IsOptional()
    @IsString({ message: "where должен быть строкой" })
    where?: string;

    @ApiPropertyOptional({
        example: "email",
        description: "Поле для точного фильтра"
    })
    @IsOptional()
    @IsString({ message: "whereField должен быть строкой" })
    whereField?: string;

    @ApiPropertyOptional({
        example: "user",
        description: "Строка поиска"
    })
    @IsOptional()
    @IsString({ message: "search должен быть строкой" })
    search?: string;

    @ApiPropertyOptional({
        example: "email",
        description: "Поле для поиска"
    })
    @IsOptional()
    @IsString({ message: "searchField должен быть строкой" })
    searchField?: string;

    @ApiPropertyOptional({
        example: "asc",
        enum: ["asc", "desc"],
        description: "Направление сортировки"
    })
    @IsOptional()
    @IsIn(["asc", "desc"], { message: "order должен быть asc или desc" })
    order?: string;

    @ApiPropertyOptional({
        example: "createdAt",
        description: "Поле сортировки"
    })
    @IsOptional()
    @IsString({ message: "orderBy должен быть строкой" })
    orderBy?: string;

    @ApiPropertyOptional({
        example: 1,
        description: "Номер страницы"
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Страница всегда число" })
    @Min(1, { message: "Страница не может быть меньше 1" })
    page?: number;

    @ApiPropertyOptional({
        example: 10,
        description: "Количество элементов на странице"
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Лимит всегда число" })
    @Min(1, { message: "Лимит не может быть меньше 1" })
    limit?: number;
}