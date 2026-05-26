import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { EventRegistrationsService } from "./event_registrations.service";
import { ChangeEventRegistrationStatusDTO, CreateEventRegistrationDTO, EventRegistrationAnswerDTO } from "./dto/event_registration.dto";
import { EventRegistrationStatus } from "@prisma/client";

@ApiTags('Event registrations')
@Controller('event-registration')
export class EventRegistrationsController {
    constructor (private eventRegistrationService: EventRegistrationsService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Зарегистрировать пользователя на событие" })
    @ApiOkResponse({ type: EventRegistrationAnswerDTO })
    private async register (@Body() data: CreateEventRegistrationDTO): Promise<EventRegistrationAnswerDTO> {
        const register = await this.eventRegistrationService.registerUserForAnEvent(data);
        return register;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Одобрить администрацией регистрацию на событие" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: EventRegistrationAnswerDTO })
    @Put('apply/:id')
    private async apply (@Param("id") id: string): Promise<EventRegistrationAnswerDTO> {
        const apply = await this.eventRegistrationService.applyUserRegistrationToEvent(id);
        return apply;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Отменить администрацией регистрацию на событие" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: EventRegistrationAnswerDTO })
    @Put('cancel/:id')
    private async cancel (@Param("id") id: string): Promise<EventRegistrationAnswerDTO> {
        const cancel = await this.eventRegistrationService.cancelRegistrationForUserToEvent(id);
        return cancel;
    }

    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Поставить необходимый статус для необычного кейса пользователя на событие" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: EventRegistrationAnswerDTO })
    @Put('change/:id')
    private async changeAnyStatus (
        @Param("id") id: string,
        @Body() data: ChangeEventRegistrationStatusDTO
    ): Promise<EventRegistrationAnswerDTO> {
        const changed = await this.eventRegistrationService.changeStatusForRegistrationUserToEvent(id, data.status);
        return changed;
    }

    @Get()
    @ApiOperation({ summary: "Получить все регистрации на событие по статусу" })
    @ApiParam({ name: "status", example: "APPROVED" })
    @ApiOkResponse({ type: EventRegistrationAnswerDTO, isArray: true })
    private async getAllByStatus (@Query("status") status: EventRegistrationStatus): Promise<EventRegistrationAnswerDTO[]> {
        const registrations = await this.eventRegistrationService.getAllRegistrationsForEvenByFilter(status);
        return registrations;
    }
}

