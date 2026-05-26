import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateRoleDTO, RoleAnswerDTO, UpdateRoleDTO } from "./dto/role.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO } from "src/core/dto/global.dto";
import { findAndPaginate } from "src/core/utils/model_metadata.util";

@Injectable()
export class RoleService {
    constructor (private prisma: PrismaService) {}

    async createRole (data: CreateRoleDTO): Promise<RoleAnswerDTO> {
        const createdRole = await this.prisma.roles.create({ data });

        if (!createdRole) {
            throw new InternalServerErrorException('Не получилось создать роль');
        }

        return  createdRole;
    }

    async updateRole (id: string, data: UpdateRoleDTO): Promise<RoleAnswerDTO> {
        const roleExist = await this.prisma.roles.findUnique({ where: { id } });

        if (!roleExist) {
            throw new NotFoundException('Роль не найдена');
        }

        const updatedRole = await this.prisma.roles.update({ where: { id }, data });

        if (!updatedRole) {
            throw new InternalServerErrorException('Не получилось обновить роль');
        }

        return updatedRole;
    }

    async deleteRole (id: string): Promise<DeletedMessageDTO> {
        const roleExist = await this.prisma.roles.findUnique({ where: { id } });

        if (!roleExist) {
            throw new NotFoundException('Роль не найдена');
        }

        await this.prisma.roles.delete({ where: { id } });

        return { 
            message: 'Роль успешно удалена' 
        };
    }

    async getRoleById (id: string): Promise<RoleAnswerDTO> {
        const role = await this.prisma.roles.findUnique({ where: { id } });

        if (!role) {
            throw new NotFoundException('Роль не найдена');
        }

        return role;
    }

    async getRoleByName (name: string): Promise<RoleAnswerDTO> {
        const role = await this.prisma.roles.findUnique({ where: { name } });

        if (!role) {
            throw new NotFoundException('Роль не найдена');
        }

        return role;
    }

    async getAllRolesByFilter (paginate: PaginateDTO, filters: FiltersDTO) {
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

        const roles = await findAndPaginate(this.prisma.roles, {
            where: whereClause,
            orderBy: order,
            page,
            limit
        });

        return roles;
    }
}