import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { CreateLocationDTO, LocationAnswerDTO, LocationDTO, UpdateLocationDTO } from "./dto/locations.dto";
import { LocationsService } from "./locations.service";

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
    constructor (private locationService: LocationsService) {}

    @Post()
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать локацию" })
    @ApiOkResponse({ type: LocationAnswerDTO })
    private async create (@Body() location: CreateLocationDTO): Promise<LocationAnswerDTO> {
        const createdLocation = await this.locationService.createLocation(location);
        return createdLocation;
    }

    @Put(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить локацию" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: LocationAnswerDTO })
    private async update (@Param() id: string, @Body() location: UpdateLocationDTO): Promise<LocationAnswerDTO> {
        const updatedLocation = await this.locationService.updateLocations(id, location);
        return updatedLocation;
    }

    @Delete(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить локацию" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param() id: string): Promise<DeletedMessageDTO> {
        const deletedLocation = await this.locationService.deleteLocations(id);
        return deletedLocation;
    }

    @Get(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить локацию по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: LocationAnswerDTO })
    private async getById (@Param() id: string): Promise<LocationAnswerDTO> {
        const location = await this.locationService.getOneLocationById(id);
        return location;
    }

    @Get()
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список локаций" })
    @ApiOkResponse({ type: LocationDTO, isArray: true })
    private async getAllByFilter (@Query() query: QueryDTO) {
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

        const location = await this.locationService.getAllLocationsByFilter(paginate, filters);
        return location;
    }
}