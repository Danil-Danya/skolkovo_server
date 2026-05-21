import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { CreateNewsCategoryDTO, NewsCategoryAnswerDTO, NewsCategoryDTO, UpdateNewsCategoryDTO } from "./dto/news_categories.dto";
import { NewsCategoryService } from "./news_category.service";

@ApiTags("News Categories")
@Controller("news-categories")
export class NewsCategoryController {
    constructor (private newsCategoriesService: NewsCategoryService) {}

    @Post()
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Создать категорию новости" })
    @ApiOkResponse({ type: NewsCategoryAnswerDTO })
    private async create (@Body() data: CreateNewsCategoryDTO): Promise<NewsCategoryAnswerDTO> {
        const createdNewsCategory = await this.newsCategoriesService.createNewsCategory(data);
        return createdNewsCategory;
    }

    @Put(":id")
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить категорию новости" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsCategoryAnswerDTO })
    private async update (
        @Param("id") id: string,
        @Body() data: UpdateNewsCategoryDTO
    ): Promise<NewsCategoryAnswerDTO> {
        const updatedNewsCategory = await this.newsCategoriesService.updateNewsCategory(id, data);
        return updatedNewsCategory;
    }

    @Delete(":id")
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить категорию новости" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedNewsCategory = await this.newsCategoriesService.deleteNewsCategory(id);
        return deletedNewsCategory;
    }

    @Get(":id")
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Получить категорию новости по Id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsCategoryAnswerDTO })
    private async getOneById (@Param("id") id: string): Promise<NewsCategoryAnswerDTO> {
        const newsCategory = await this.newsCategoriesService.getNewsCategoryById(id);
        return newsCategory;
    }

    @Get()
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Получить категории новостей по фильтру" })
    @ApiOkResponse({ type: NewsCategoryDTO, isArray: true })
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

        const newsCategories = await this.newsCategoriesService.getAllNewsCategoriesByFilter(paginate, filters);
        return newsCategories;
    }
}