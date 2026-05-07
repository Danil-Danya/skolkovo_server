import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { UploadFiles } from "src/core/decorators/upload_files.decorator";
import type { UploadedStaticFile, UploadedStaticFilesMap } from "src/core/types/files.type";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { CreateNewsDTO, CreateNewsWithFilesDTO, NewsAnswerDTO, NewsContentDTO, NewsDTO, UpdateNewsDTO } from "./dto/news.dto";
import { NewsService } from "./news.service";

type NewsUploadedFiles = UploadedStaticFilesMap & {
    preview?: UploadedStaticFile[];
    contentImages?: UploadedStaticFile[];
};

const CONTENT_IMAGE_PLACEHOLDER_REGEX = /^__content_image_(\d+)__$/;

const newsMultipartBodySchema = {
    type: "object",
    properties: {
        authorId: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000"
        },
        title: {
            type: "string",
            example: "News title"
        },
        shortDescription: {
            type: "string",
            example: "Short description"
        },
        views: {
            type: "integer",
            example: 0
        },
        previewPath: {
            type: "string",
            nullable: true,
            example: "/static/news/existing-preview.webp"
        },
        preview: {
            type: "string",
            format: "binary"
        },
        content: {
            type: "string",
            example: JSON.stringify([
                {
                    subtitle: "Block with image",
                    text: "Main text",
                    imagePath: "__content_image_0__"
                },
                {
                    subtitle: "Text block",
                    text: "No image here"
                }
            ])
        },
        contentImages: {
            type: "array",
            items: {
                type: "string",
                format: "binary"
            }
        }
    }
} as const;

@ApiTags("News")
@Controller("news")
export class NewsController {
    constructor (private newsService: NewsService) {}

    private mapContentImages (
        content: NewsContentDTO[],
        contentImages: UploadedStaticFile[] = []
    ): NewsContentDTO[] {
        const usedIndexes = new Set<number>();

        const mappedContent = content.map((block, blockIndex) => {
            if (!block.imagePath) {
                return block;
            }

            const placeholderMatch = block.imagePath.match(CONTENT_IMAGE_PLACEHOLDER_REGEX);

            if (!placeholderMatch) {
                return block;
            }

            const fileIndex = Number(placeholderMatch[1]);
            const uploadedImage = contentImages[fileIndex];

            if (!uploadedImage) {
                throw new BadRequestException(`Отсутствует contentImages[${fileIndex}] для content[${blockIndex}]`);
            }

            usedIndexes.add(fileIndex);

            return {
                ...block,
                imagePath: uploadedImage.url
            };
        });

        if (contentImages.length > 0 && usedIndexes.size === 0) {
            throw new BadRequestException("Используйте плейсхолдеры imagePath вида __content_image_0__ внутри content");
        }

        const unusedIndexes = contentImages
            .map((_, index) => index)
            .filter((index) => !usedIndexes.has(index));

        if (unusedIndexes.length > 0) {
            throw new BadRequestException(`Неиспользованные contentImages: ${unusedIndexes.map((index) => `contentImages[${index}]`).join(", ")}`);
        }

        return mappedContent;
    }

    private prepareNewsData (
        data: CreateNewsWithFilesDTO | UpdateNewsDTO,
        files?: NewsUploadedFiles
    ): UpdateNewsDTO {
        const preview = files?.preview?.[0];
        const contentImages = files?.contentImages ?? [];

        if (contentImages.length > 0 && !data.content) {
            throw new BadRequestException("content is required when contentImages are uploaded");
        }

        return {
            ...data,
            previewPath: preview?.url ?? data.previewPath,
            content: data.content
                ? this.mapContentImages(data.content, contentImages)
                : data.content
        };
    }

    @Post()
    // //@Auth()
    // @ApiBearerAuth()
    @UploadFiles([
        { name: "preview", maxCount: 1 },
        { name: "contentImages", maxCount: 20 }
    ], "news")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Создать новость" })
    @ApiBody({
        schema: {
            ...newsMultipartBodySchema,
            required: ["authorId", "title", "content", "shortDescription"]
        }
    })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async create (
        @Body() data: CreateNewsWithFilesDTO,
        @UploadedFiles() files?: NewsUploadedFiles
    ): Promise<NewsAnswerDTO> {
        const preparedNews = this.prepareNewsData(data, files);

        if (!preparedNews.previewPath) {
            throw new BadRequestException("previewPath or preview file is required");
        }

        const createdNews = await this.newsService.createNews(preparedNews as CreateNewsDTO);
        return createdNews;
    }

    @Delete(":id")
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить новость" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedNews = await this.newsService.deleteNews(id);
        return deletedNews;
    }

    @Get()
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Получить новости по фильтру" })
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

    @Get(":id")
    // //@Auth()
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Получить новость по Id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async getById (@Param("id") id: string) {
        const news = await this.newsService.getNewsById(id);
        return news;
    }

    @Put(":id")
    //@Auth()
    @ApiBearerAuth()
    @UploadFiles([
        { name: "preview", maxCount: 1 },
        { name: "contentImages", maxCount: 20 }
    ], "news")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Обновить новость" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiBody({ schema: newsMultipartBodySchema })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async update (
        @Param("id") id: string,
        @Body() data: UpdateNewsDTO,
        @UploadedFiles() files?: NewsUploadedFiles
    ): Promise<NewsAnswerDTO> {
        const preparedNews = this.prepareNewsData(data, files);
        const updatedNews = await this.newsService.updateNews(id, preparedNews);
        return updatedNews;
    }

    @Put(":id/counter-views")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Посчитать счетчик просмотров" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: NewsAnswerDTO })
    private async updateCounter (@Param("id") id: string): Promise<NewsAnswerDTO> {
        const updatedViewsInViews = await this.newsService.updateNewsCounter(id);
        return updatedViewsInViews;
    }
}
