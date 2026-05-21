import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateEventDTO, EventAnswerDTO, UpdateEventDTO } from "./dto/events.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { Prisma } from "prisma/generated/browser";
import { findAndPaginate } from "src/core/utils/model_metadata.util";
import { eventAnswerInclude } from "./types/event.type";
import { NotificationService } from "../notificatations/notification.service";

@Injectable()
export class EventService {
    constructor (
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) {}

    async createEvent (data: CreateEventDTO): Promise<EventAnswerDTO> {
        const createdEvent = await this.prisma.events.create({
            data: {
                ...data,
                description: data.description as unknown as Prisma.InputJsonValue,
                views: data.views ?? 0
            }
        }) as EventAnswerDTO;

        if (!createdEvent) {
            throw new InternalServerErrorException('Не получилось создать событие');
        }

        await this.notificationService.createNotificationsForAllUsers({
            title: `Новое событие ${createdEvent.title} скоро состоится!`,
            text: `Уважаемые участники! Рады сообщить вам о новом событии "${createdEvent.title}", которое скоро состоится. Не упустите возможность принять участие и узнать больше о строительстве и инновациях в Сколково!`
        });

        return createdEvent;
    }

    async updateEvent (id: string, data: UpdateEventDTO): Promise<EventAnswerDTO> {
        const eventExist = await this.prisma.events.findUnique({
            where: {
                id
            }
        });

        if (!eventExist) {
            throw new NotFoundException('Не получилось найти данное событие');
        }

        const updatedEvent = await this.prisma.events.update({
            where: {
                id
            },
            data: {
                ...data,
                description: data.description as unknown as Prisma.InputJsonValue,
                views: data.views ?? 0
            }
        }) as EventAnswerDTO;

        if (!updatedEvent) {
            throw new InternalServerErrorException('Не получилось обновить данную кабинку');
        }

        return updatedEvent;
    }

    async deleteEvent (id: string): Promise<DeletedMessageDTO> {
        const eventExist = await this.prisma.events.findUnique({
            where: {
                id
            }
        });

        if (!eventExist) {
            throw new NotFoundException('Не получилось найти данное событие');
        }

        await this.prisma.events.delete({
            where: {
                id
            }
        });

        return {
            message: 'Событие было успешно удалено'
        }
    }

    async getOneById (id: string): Promise<EventAnswerDTO> {
        const event = await this.prisma.events.findUnique({
            where: {
                id
            },
            include: eventAnswerInclude
        }) as EventAnswerDTO;

        if (!event) {
            throw new NotFoundException('Не получилось найти данное событие');
        }

        return event;
    }

    async getAllByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
        const whereClause = {};
        let order = {};

        const page = paginate?.page ?? 1;
        const limit = paginate?.limit ?? 10;

        if (filters?.where && filters?.whereField) {
            whereClause[filters.whereField] = filters.where;
        }

        if (filters?.search && filters?.searchField) {
            whereClause[filters.searchField] = {
                contains: filters.search,
                mode: 'insensitive'
            };
        }

        if (filters?.order && filters?.orderBy) {
            order = { [filters.orderBy]: filters.order };
        }

        const include = {
            location: {
                select: {
                    name: true,
                    address: true,
                    lat: true,
                    long: true,
                    yandexLink: true
                }
            }
        }

        const news = await findAndPaginate(this.prisma.events, {
            where: whereClause,
            orderBy: order,
            include: eventAnswerInclude,
            page,
            limit
        });

        return news;
    }
}