import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { CreateLocationDTO, LocationAnswerDTO, LocationDTO, UpdateLocationDTO } from "./dto/locations.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class LocationsService {
    constructor (private prisma: PrismaService) {}

    async createLocation (data: CreateLocationDTO): Promise<LocationAnswerDTO> {
        const createdLocation = await this.prisma.locations.create({ data });
        
        if (!createdLocation) {
            throw new InternalServerErrorException('Не получилось создать локацию');
        }

        return createdLocation;
    }

    async updateLocations (id: string, data: UpdateLocationDTO): Promise<LocationAnswerDTO> {
        const locationExist = await this.prisma.locations.findUnique({
            where: {
                id
            }
        });

        if (!locationExist) {
            throw new NotFoundException('Локация не была найдена');
        }

        const updatedLocation = await this.prisma.locations.update({
            where: {
                id
            },
            data
        });

        if (!updatedLocation) {
            throw new InternalServerErrorException('Не получилось обновить локацию');
        }

        return updatedLocation;
    }

    async deleteLocations (id: string): Promise<DeletedMessageDTO> {
        const locationExist = await this.prisma.locations.findUnique({
            where: {
                id
            }
        });

        if (!locationExist) {
            throw new NotFoundException('Локация не была найдена');
        }

        await this.prisma.locations.delete({
            where: {
                id
            }
        });

        return {
            message: 'Локация была успешно удалена'
        }
    }

    async getOneLocationById (id: string): Promise<LocationAnswerDTO> {
        const location = await this.prisma.locations.findUnique({
            where: {
                id
            }
        });

        if (!location) {
            throw new NotFoundException('Локация не была найдена');
        }

        return location;
    }

    async getAllLocationsByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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

        const locations = await findAndPaginate(this.prisma.locations, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });

        return locations;
    }
}