import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { CreateRoleDTO, RoleAnswerDTO, RoleDTO, UpdateRoleDTO } from "./dto/role.dto";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@Controller("roles")
export class RoleController {
    constructor (private roleService: RoleService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать роль" })
    @ApiOkResponse({ type: RoleAnswerDTO })
    private async create (@Body() data: CreateRoleDTO): Promise<RoleAnswerDTO> {
        const createdRole = await this.roleService.createRole(data);
        return createdRole;
    }

    @Put(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить роль" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: RoleAnswerDTO })
    private async update (@Param("id") id: string, @Body() data: UpdateRoleDTO): Promise<RoleAnswerDTO> {
        const updatedRole = await this.roleService.updateRole(id, data);
        return updatedRole;
    }

    @Delete(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить роль" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedRole = await this.roleService.deleteRole(id);
        return deletedRole;
    }

    @Get(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить роль по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: RoleAnswerDTO })
    private async getOneById (@Param("id") id: string): Promise<RoleAnswerDTO> {
        const role = await this.roleService.getRoleById(id);
        return role;
    }

    @Get("name/:name")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить роль по имени" })
    @ApiParam({ name: "name", example: "admin" })
    @ApiOkResponse({ type: RoleAnswerDTO })
    private async getOneByName (@Param("name") name: string): Promise<RoleAnswerDTO> {
        const role = await this.roleService.getRoleByName(name);
        return role;
    }

    @Get()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список ролей" })
    @ApiOkResponse({ type: RoleDTO, isArray: true })
    private async getAllByFilter (@Query() query: QueryDTO) {
        const filters: FiltersDTO = {
            where: query.where,
            whereField: query.whereField,
            search: query.search,
            searchField: query.searchField,
            order: query.order,
            orderBy: query.orderBy
        };

        const paginate: PaginateDTO = {
            page: query.page,
            limit: query.limit
        };

        const roles = await this.roleService.getAllRolesByFilter(paginate, filters);
        return roles;
    }
}
