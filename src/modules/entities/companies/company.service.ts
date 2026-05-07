import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCompanyDTO, UpdateCompanyDTO, CompanyAnswerDTO } from "./dto/company.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class CompanyService {
    constructor (private prisma: PrismaService) {}

    async createCompany (data: CreateCompanyDTO): Promise<CompanyAnswerDTO> {
        const createdCompany = await this.prisma.companies.create({ data });

        if (!createdCompany) {
            throw new InternalServerErrorException("Не получилось создать компанию");
        }

        return createdCompany;
    }

    async updateCompany (id: string, data: UpdateCompanyDTO): Promise<CompanyAnswerDTO> {
        const companyExist = await this.prisma.companies.findUnique({
            where: {
                id
            }
        });

        if (!companyExist) {
            throw new NotFoundException("Не получилось найти данную компанию");
        }

        const updatedCompany = await this.prisma.companies.update({
            where: {
                id
            },
            data
        });

        if (!updatedCompany) {
            throw new InternalServerErrorException("Не получилось обновить компанию");
        }

        return updatedCompany;
    }

    async deleteCompany (id: string): Promise<DeletedMessageDTO> {
        const companyExist = await this.prisma.companies.findUnique({
            where: {
                id
            }
        });

        if (!companyExist) {
            throw new NotFoundException("Не получилось найти данную компанию");
        }

        await this.prisma.companies.delete({
            where: {
                id
            }
        });

        return {
            message: "Компания была успешно удалена"
        };
    }

    async getOneCompanyById (id: string): Promise<CompanyAnswerDTO> {
        const company = await this.prisma.companies.findUnique({
            where: {
                id
            }
        });

        if (!company) {
            throw new NotFoundException("Не получилось найти данную компанию");
        }

        return company;
    }

    async getAllCompaniesByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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

        return await findAndPaginate(this.prisma.companies, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });
    }
}