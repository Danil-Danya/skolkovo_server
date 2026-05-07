import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreatePositionDTO, PositionAnswerDTO, UpdatePositionDTO } from "./dto/position.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class PositionService {
    constructor (private prisma: PrismaService) {}

    async createPosition (data: CreatePositionDTO): Promise<PositionAnswerDTO> {
        const createdPosition = await this.prisma.positions.create({ data });

        if (!createdPosition) {
            throw new InternalServerErrorException("Должность не была создана");
        }

        return createdPosition;
    }

    async updatePosition (id: string, data: UpdatePositionDTO): Promise<PositionAnswerDTO> {
        const positionExist = await this.prisma.positions.findUnique({
            where: {
                id
            }
        });

        if (!positionExist) {
            throw new NotFoundException("Данная должность не была найдена");
        }

        const updatedPosition = await this.prisma.positions.update({
            where: {
                id
            },
            data
        });

        if (!updatedPosition) {
            throw new InternalServerErrorException("Не получилось обновить должность");
        }

        return updatedPosition;
    }

    async deletePosition (id: string): Promise<DeletedMessageDTO> {
        const positionExist = await this.prisma.positions.findUnique({
            where: {
                id
            }
        });

        if (!positionExist) {
            throw new NotFoundException("Данная должность не была найдена");
        }

        await this.prisma.positions.delete({
            where: {
                id
            }
        });

        return {
            message: "Должность была успешно удалена"
        };
    }

    async getOnePositionById (id: string): Promise<PositionAnswerDTO> {
        const position = await this.prisma.positions.findUnique({
            where: {
                id
            }
        });

        if (!position) {
            throw new NotFoundException("Данная позиция не была найдена");
        }

        return position;
    }

    async getAllPositionsByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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

        const positions = await findAndPaginate(this.prisma.positions, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });

        return positions;
    }
}
