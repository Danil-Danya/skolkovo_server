import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UploadFile } from "src/core/decorators/upload_file.decorator";
import type { UploadedStaticFile } from "src/core/types/files.type";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { EventService } from "./events.service";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { CreateEventDTO, CreateEventWithPreviewDTO, EventAnswerDTO, UpdateEventDTO } from "./dto/events.dto";

@ApiTags("Events")
@Controller("events")
export class EventController {
    constructor (private eventsService: EventService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @UploadFile("preview", "events")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Создать Событие" })
    @ApiBody({ type: CreateEventWithPreviewDTO })
    private async create (
        @Body() data: CreateEventWithPreviewDTO,
        @UploadedFile() preview?: UploadedStaticFile
    ): Promise<EventAnswerDTO> {
        const { preview: _, ...eventData } = data;

        const createdEvent = await this.eventsService.createEvent({
            ...eventData,
            previewPath: preview?.url ?? data.previewPath
        } as CreateEventDTO);

        return createdEvent;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить событие" })
    @Put(":id")
    private async update (@Param("id") id: string, @Body() event: UpdateEventDTO): Promise<EventAnswerDTO>  {
        const updatedEvent = this.eventsService.updateEvent(id, event);
        return updatedEvent;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить событие" })
    @Delete(":id")
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO>  {
        const deletedEvent = await this.eventsService.deleteEvent(id);
        return deletedEvent;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить событие по id" })
    @Get(":id")
    private async getById (@Param("id") id: string): Promise<EventAnswerDTO>  {
        const event = await this.eventsService.getOneById(id);
        return event;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить события по фильтру" })
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
