import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EventService } from "../events/events.service";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateEventRegistrationDTO, EventRegistrationAnswerDTO } from "./dto/event_registration.dto";
import { EventRegistrationStatus } from "@prisma/client";
import { EVENT_STATUSES } from "../events/types/event-status.type";

@Injectable()
export class EventRegistrationsService {
    constructor (
        private eventService: EventService,
        private prisma: PrismaService
    ) {}

    async registerUserForAnEvent (data: CreateEventRegistrationDTO): Promise<EventRegistrationAnswerDTO> {
        const event = await this.eventService.getOneById(data.eventId);

        if (event.status !== EVENT_STATUSES.CREATED) {
            throw new BadRequestException('Р—Р°РїРёСЃСЊ РЅР° РґР°РЅРЅРѕРµ СЃРѕР±С‹С‚РёРµ Р·Р°РєСЂС‹С‚Р°');
        }

        const eventRegistration = await this.prisma.event_registrations.create({ data });

        return eventRegistration;
    }

    async cancelRegistrationForUserToEvent (id: string) {
        const eventRegistrationExist = await this.prisma.event_registrations.findUnique({
            where: {
                id
            }
        });

        if (!eventRegistrationExist) {
            throw new NotFoundException('Не получилось найти запись на событие');
        }

        const canceledRegistrationToEvent = await this.prisma.event_registrations.update({
            where: {
                id
            },
            data: {
                status: "CANCELED"
            }
        });

        if (!canceledRegistrationToEvent) {
            throw new InternalServerErrorException('Не получилось отменить регистрацию на событие');
        }

        return canceledRegistrationToEvent;
    }

    async applyUserRegistrationToEvent (id: string): Promise<EventRegistrationAnswerDTO> {
        const eventRegistrationExist = await this.prisma.event_registrations.findUnique({
            where: {
                id
            }
        });

        if (!eventRegistrationExist) {
            throw new NotFoundException('Не получилось найти запись на событие');
        }

        const appliedRegistrationToEvent = await this.prisma.event_registrations.update({
            where: {
                id
            },
            data: {
                status: "APPROVED"
            }
        });

        if (!appliedRegistrationToEvent) {
            throw new InternalServerErrorException('Не получилось одобрить регистрацию на событие');
        }

        return appliedRegistrationToEvent;
    }

    async changeStatusForRegistrationUserToEvent (id: string, status: EventRegistrationStatus): Promise<EventRegistrationAnswerDTO> {
        const eventRegistrationExist = await this.prisma.event_registrations.findUnique({
            where: {
                id
            }
        });

        if (!eventRegistrationExist) {
            throw new NotFoundException('Не получилось найти запись на событие');
        }

        const changedRegistrationToEvent = await this.prisma.event_registrations.update({
            where: {
                id
            },
            data: {
                status
            }
        });

        if (!changedRegistrationToEvent) {
            throw new InternalServerErrorException('Не получилось изменить статус регистрации на событие');
        }

        return changedRegistrationToEvent;
    }

    async getAllRegistrationsForEvenByFilter (status: EventRegistrationStatus): Promise<EventRegistrationAnswerDTO[]> {
        const eventRegistrations = await this.prisma.event_registrations.findMany({
            where: {
                status: status as EventRegistrationStatus
            },
            include: {
                event: true,
                user: true
            }
        });

        if (!eventRegistrations) {
            throw new NotFoundException('Не получилось найти записи на события');
        }

        return eventRegistrations;
    }
}
