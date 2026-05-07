import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateUserDTO, UpdateUserDTO, UserAnswerDTO, UserDTO } from "./dto/users.dto";
import { UsersService } from "./users.service";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { ApiOkResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать пользователя" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async create (@Body() user: CreateUserDTO): Promise<UserAnswerDTO> {
        const createdUser = await this.usersService.createUser(user);
        return createdUser;
    }

    @Delete(':id')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить пользователя" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedMessage = await this.usersService.deleteUser(id);
        return deletedMessage;
    }

    @Get()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список пользователей" })
    @ApiOkResponse({ type: UserDTO, isArray: true })
    private async getUserByFilter (@Query() query: QueryDTO) {
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
        const users = await this.usersService.getAllUsersByFilter(paginate, filters);
        return users;
    }

    @Get(':id')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить пользователя по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async getOneById (@Param("id") id: string) {
        const user = await this.usersService.getOneUserById(id);
        return user;
    }

    @Get('/user/:tgUserName')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить пользователя по chatId" })
    @ApiParam({ name: "tgUserName", example: "admin" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async getOneByUsername (@Param("tgUserName") tgUserName: string) {
        const user = await this.usersService.getOneUserByUsername(tgUserName);
        return user;
    }

    @Put(':id')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить пользователя" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async update (@Param("id") id: string, @Body() user: UpdateUserDTO): Promise<UserAnswerDTO> {
        const updatedUser = await this.usersService.updateUser(id, user);
        return updatedUser;
    }
}
