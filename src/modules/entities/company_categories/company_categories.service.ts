import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CompanyCategoryAnswerDTO, CreateCompanyCategoryDTO, UpdateCompanyCategoryDTO } from "./dto/company_categories.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class CompanyCategoriesService {
    constructor (private prisma: PrismaService) {}

    async createCompanyCategory (data: CreateCompanyCategoryDTO): Promise<CompanyCategoryAnswerDTO> {
        const createdCompanyCategory = await this.prisma.company_categories.create({ data });

        if (!createdCompanyCategory) {
            throw new InternalServerErrorException("Ошибка при создании категории компании");
        }

        return createdCompanyCategory;
    }

    async updateCompanyCategory (id: string, data: UpdateCompanyCategoryDTO): Promise<CompanyCategoryAnswerDTO> {
        const companyCategoryExists = await this.prisma.company_categories.findUnique({ where: { id } });

        if (!companyCategoryExists) {
            throw new NotFoundException("Категория компании не найдена");
        }

        const updatedCompanyCategory = await this.prisma.company_categories.update({
            where: { id },
            data
        });

        if (!updatedCompanyCategory) {
            throw new InternalServerErrorException("Ошибка при обновлении категории компании");
        }

        return updatedCompanyCategory;
    }

    async deleteCompanyCategory (id: string): Promise<DeletedMessageDTO> {
        const companyCategoryExists = await this.prisma.company_categories.findUnique({ where: { id } });

        if (!companyCategoryExists) {
            throw new NotFoundException("Категория компании не найдена");
        }

        await this.prisma.company_categories.delete({ where: { id } });

        return { 
            message: "Категория компании успешно удалена" 
        }
    }

    async getCompanyCategoryById (id: string): Promise<CompanyCategoryAnswerDTO> {
        const companyCategory = await this.prisma.company_categories.findUnique({ 
            where: { 
                id 
            },
            include: {
                _count: true,
                companies: {
                    select: {
                        _count: true,
                        id: true,
                        inn: true,
                        name: true,
                        description: true,
                        previewPath: true,
                    }
                }
            }
        });

        if (!companyCategory) {
            throw new NotFoundException("Категория компании не найдена");
        }

        return companyCategory;
    }

    async getAllCompanyCategoriesByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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

        const skip = (page - 1) * limit;

        const companyCategories = await findAndPaginate(this.prisma.company_categories, {
            where: whereClause,
            orderBy: order,
            include: {
                _count: true,
                companies: {
                    select: {
                        _count: true,
                        id: true,
                        inn: true,
                        name: true,
                        description: true,
                        previewPath: true,
                    }
                }
            },
            page,
            limit
        });

        return companyCategories;
    }
}