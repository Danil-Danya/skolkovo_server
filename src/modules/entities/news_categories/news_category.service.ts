import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { PrismaService } from "src/database/prisma/prisma.service";
import { findAndPaginate } from "src/core/utils/model_metadata.util";
import { CreateNewsCategoryDTO, NewsCategoryAnswerDTO, UpdateNewsCategoryDTO } from "./dto/news_categories.dto";

@Injectable()
export class NewsCategoryService {
    constructor (private prisma: PrismaService) {}

    private async ensureNewsCategoryExists (id: string): Promise<void> {
        const newsCategory = await this.prisma.news_categories.findUnique({
            where: {
                id
            }
        });

        if (!newsCategory) {
            throw new NotFoundException("Не удалось найти данную категорию новости");
        }
    }

    async createNewsCategory (data: CreateNewsCategoryDTO): Promise<NewsCategoryAnswerDTO> {
        const createdNewsCategory = await this.prisma.news_categories.create({
            data
        }) as NewsCategoryAnswerDTO;

        if (!createdNewsCategory) {
            throw new InternalServerErrorException("Не получилось создать категорию новости");
        }

        return createdNewsCategory;
    }

    async updateNewsCategory (id: string, data: UpdateNewsCategoryDTO): Promise<NewsCategoryAnswerDTO> {
        await this.ensureNewsCategoryExists(id);

        const updatedNewsCategory = await this.prisma.news_categories.update({
            where: {
                id
            },
            data
        }) as NewsCategoryAnswerDTO;

        if (!updatedNewsCategory) {
            throw new InternalServerErrorException("Не получилось обновить категорию новости");
        }

        return updatedNewsCategory;
    }

    async deleteNewsCategory (id: string): Promise<DeletedMessageDTO> {
        await this.ensureNewsCategoryExists(id);

        await this.prisma.news_categories.delete({
            where: {
                id
            }
        });

        return {
            message: "Данная категория новости была успешно удалена"
        };
    }

    async getNewsCategoryById (id: string): Promise<NewsCategoryAnswerDTO> {
        const newsCategory = await this.prisma.news_categories.findUnique({
            where: {
                id
            }
        }) as NewsCategoryAnswerDTO;

        if (!newsCategory) {
            throw new NotFoundException("Не удалось найти данную категорию новости");
        }

        return newsCategory;
    }

    async getAllNewsCategoriesByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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
                mode: "insensitive"
            };
        }

        if (filters?.order && filters?.orderBy) {
            order = { [filters.orderBy]: filters.order };
        }

        const newsCategories = await findAndPaginate(this.prisma.news_categories, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });

        return newsCategories;
    }
}