import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { EventService } from "./events.service";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { CreateEventDTO, EventAnswerDTO, UpdateEventDTO } from "./dto/events.dto";


@ApiTags('Events')
@Controller('events')
export class EventController {
    constructor (private eventsService: EventService) {}

    @Post()
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать Событие" })
    private async create (@Body() event: CreateEventDTO): Promise<EventAnswerDTO> {
        const createdEvent = await this.eventsService.createEvent(event);
        return createdEvent;
    }

    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить Событие" })
    @Put(':id')
    private async update (@Param() id: string, @Body() event: UpdateEventDTO): Promise<EventAnswerDTO>  {
        const updatedEvent = this.eventsService.updateEvent(id, event);
        return updatedEvent;
    }

    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить Событие" })
    @Delete(':id')
    private async delete (@Param() id: string): Promise<DeletedMessageDTO>  {
        const deletedEvent = await this.eventsService.deleteEvent(id);
        return deletedEvent;
    }

    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить Событие по Id" })
    @Get(':id')
    private async getById (@Param() id: string): Promise<EventAnswerDTO>  {
        const event = await this.eventsService.getOneById(id);
        return event;
    }

    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить событие по фильтру" })
    @Get()
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

        const events = await this.eventsService.getAllByFilter(paginate, filters);
        return events;
    }
}