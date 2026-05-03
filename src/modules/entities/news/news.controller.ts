import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateNewsDTO, UpdateNewsDTO, NewsAnswerDTO, NewsDTO } from "./dto/news.dto";
import { NewsService } from "./news.service";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { ApiOkResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags("News")
@Controller('news')
export class NewsController {
    constructor (private newsService: NewsService) {}

    @Post()
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Создать новость" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async create (@Body() news: CreateNewsDTO): Promise<NewsAnswerDTO> {
        const createdNews = await this.create(news);
        return createdNews;
    }

    @Delete(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить новость" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param() id: string): Promise<DeletedMessageDTO> {
        const deletedNews = await this.newsService.deleteNews(id);
        return deletedNews;
    }

    @Get()
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список новостей" })
    @ApiOkResponse({ type: NewsDTO, isArray: true })
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

        const news = await this.newsService.getAllNewsByFilter(paginate, filters);
        return news;
    }

    @Get(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить новость по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async getById (@Param() id: string) {
        const news = await this.newsService.getNewsById(id);
        return news;
    }

    @Put(':id')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить новость" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async update (@Param() id: string, @Body() news: UpdateNewsDTO): Promise<NewsAnswerDTO> {
        const updatedNews = await this.newsService.updateNews(id, news);
        return updatedNews;
    }

    @Put(':id/counter-views')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Обновить счетчик просмотров новости" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async updateCounter (@Param() id: string): Promise<NewsAnswerDTO> {
        const updatedViewsInViews = await this.newsService.updateNewsCounter(id);
        return updatedViewsInViews;
    }
}