import { rm } from "fs/promises";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UploadFile } from "src/core/decorators/upload_file.decorator";
import type { UploadedStaticFile } from "src/core/types/files.type";
import { PositionService } from "./position.service";
import {
    CreatePositionDTO,
    ImportPositionsFromFileDTO,
    ImportPositionsResultDTO,
    PositionAnswerDTO,
    PositionDTO,
    UpdatePositionDTO
} from "./dto/position.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags("Positions")
@Controller("positions")
export class PositionController {
    constructor (private positionService: PositionService) {}

    @Post("import")
    @UploadFile("file", "positions/imports")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Import positions from an Excel file" })
    @ApiBody({ type: ImportPositionsFromFileDTO })
    @ApiOkResponse({ type: ImportPositionsResultDTO })
    private async importFromFile (
        @Body() data: ImportPositionsFromFileDTO,
        @UploadedFile() file?: UploadedStaticFile
    ): Promise<ImportPositionsResultDTO> {
        try {
            return await this.positionService.importPositionsFromFile(file, data);
        }
        finally {
            if (file?.path) {
                await rm(file.path, { force: true }).catch(() => undefined);
            }
        }
    }

    @Post()
    // @Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Создать должность" })
    @ApiOkResponse({ type: PositionAnswerDTO })
    private async create (@Body() position: CreatePositionDTO): Promise<PositionAnswerDTO> {
        const createdPosition = await this.positionService.createPosition(position);
        return createdPosition;
    }

    @Put(":id")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить должность" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: PositionAnswerDTO })
    private async update (@Param("id") id: string, @Body() position: UpdatePositionDTO): Promise<PositionAnswerDTO> {
        const updatedPosition = await this.positionService.updatePosition(id, position);
        return updatedPosition;
    }

    @Delete(":id")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить должность" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedPosition = await this.positionService.deletePosition(id);
        return deletedPosition;
    }

    @Get(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить должность по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: PositionAnswerDTO })
    private async getOneById (@Param("id") id: string): Promise<PositionAnswerDTO> {
        const position = await this.positionService.getOnePositionById(id);
        return position;
    }

    @Get()
    // @Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список должностей" })
    @ApiOkResponse({ type: PositionDTO, isArray: true })
    private async getAllByFilters (@Query() query: QueryDTO) {
        const filters: FiltersDTO = {
            where: query.where,
            whereField: query.whereField,
            search: query.search,
            searchField: query.searchField,
            order: query.order,
            orderBy: query.orderBy
        };

        const paginate: PaginateDTO = {
            page: query.page,
            limit: query.limit
        };

        const positions = await this.positionService.getAllPositionsByFilter(paginate, filters);
        return positions;
    }
}
