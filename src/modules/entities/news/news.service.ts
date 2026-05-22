import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { PrismaService } from "src/database/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateNewsDTO, NewsAnswerDTO, UpdateNewsDTO } from "./dto/news.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";
import { NotificationService } from "../notificatations/notification.service";

@Injectable()
export class NewsService {
    constructor (
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) {}

    private async ensureAuthorExists (authorId: string): Promise<void> {
        const author = await this.prisma.users.findUnique({
            where: {
                id: authorId
            }
        });

        if (!author) {
            throw new NotFoundException("Автор новости не найден");
        }
    }

    async createNews (data: CreateNewsDTO): Promise<NewsAnswerDTO> {
        await this.ensureAuthorExists(data.authorId);

        const createdNews = await this.prisma.news.create({ 
            data: {
                ...data,
                content: data.content as unknown as Prisma.InputJsonValue,
                views: data.views ?? 0
            }
        }) as NewsAnswerDTO;

        if (!createdNews) {
            throw new InternalServerErrorException('Не получилось создать новость');
        }

        await this.notificationService.createNotificationsForAllUsers({
            title: `Новая новость: ${createdNews.title}`,
            text: `Уважаемые участники! Рады сообщить вам о новой новости "${createdNews.title}". Не упустите возможность узнать больше о строительстве и инновациях в Сколково!`
        });

        return createdNews;
    }

    async updateNews (id: string, data: UpdateNewsDTO): Promise<NewsAnswerDTO> {
        const newsExist = await this.prisma.news.findUnique({
            where: {
                id
            }
        });

        if (!newsExist) {
            throw new NotFoundException('Не удалось найти данную новость');
        }

        if (data.authorId) {
            await this.ensureAuthorExists(data.authorId);
        }

        const updatedNews = await this.prisma.news.update({
            where: {
                id
            },
            data: {
                ...data,
                content: data.content
                    ? data.content as unknown as Prisma.InputJsonValue
                    : undefined
            }
        }) as NewsAnswerDTO;

        if (!updatedNews) {
            throw new InternalServerErrorException('Не получилось обновить новость');
        }

        return updatedNews;
    }

    async updateNewsCounter (id: string): Promise<NewsAnswerDTO> {
        const newsExist = await this.prisma.news.findUnique({
            where: {
                id
            }
        });

        if (!newsExist) {
            throw new NotFoundException('Не удалось найти данную новость');
        }

        let views = newsExist.views;
        views += 1;

        const updatedViewsInViews = await this.prisma.news.update({
            where: {
                id
            },
            data: {
                views
            }
        }) as NewsAnswerDTO;

        if (!updatedViewsInViews) {
            throw new InternalServerErrorException('Не получилось обновить счетчик просмотров');
        }

        return updatedViewsInViews;
    }

    async deleteNews (id: string): Promise<DeletedMessageDTO> {
        const newsExist = await this.prisma.news.findUnique({
            where: {
                id
            }
        });

        if (!newsExist) {
            throw new NotFoundException('Не удалось найти данную новость');
        }

        await this.prisma.news.delete({
            where: {
                id
            }
        })

        return {
            message: 'Даннвя новость была успешно удалена'
        }
    }

    async getNewsById (id: string): Promise<NewsAnswerDTO> {
        const news = await this.prisma.news.findUnique({
            where: {
                id
            },
            include: {
                author: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        }) as NewsAnswerDTO;

        if (!news) {
            throw new NotFoundException('Не удалось найти данную новость');
        }

        return news;
    }

    async getAllNewsByFilter (paginate: PaginateDTO, filters: FiltersDTO, categories?: string[]) {
        const whereClause: Record<string, unknown> = {};
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

        if (categories && categories.length > 0) {
            whereClause.categoryId = {
                in: categories
            };
        }

        const news = await findAndPaginate(this.prisma.news, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });

        return news;
    }
}
