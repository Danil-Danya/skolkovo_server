import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CompanyCategoriesService } from "./company_categories.service";
import { CompanyCategoryAnswerDTO, CreateCompanyCategoryDTO, UpdateCompanyCategoryDTO } from "./dto/company_categories.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags('Company Categories')
@Controller('company-categories')
export class CompanyCategoriesController {
    constructor (private companyCategoriesService: CompanyCategoriesService) {}

    @Post()
    @Auth()
    @ApiOperation({ summary: "Создать новую категорию компании" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: CompanyCategoryAnswerDTO })
    async create (@Body() data: CreateCompanyCategoryDTO): Promise<CompanyCategoryAnswerDTO> {
        const companyCategory = await this.companyCategoriesService.createCompanyCategory(data);
        return companyCategory;
    }

    @Put(':id')
    @Auth()
    @ApiOperation({ summary: "Обновить существующую категорию компании" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: CompanyCategoryAnswerDTO })
    async update (@Param('id') id: string, @Body() data: UpdateCompanyCategoryDTO): Promise<CompanyCategoryAnswerDTO> {
        const updatedCompanyCategory = await this.companyCategoriesService.updateCompanyCategory(id, data);
        return updatedCompanyCategory;
    }

    @Delete(':id')
    @Auth()
    @ApiOperation({ summary: "Удалить существующую категорию компании" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: DeletedMessageDTO })
    async delete (@Param('id') id: string): Promise<DeletedMessageDTO> {
        const deletedMessage = await this.companyCategoriesService.deleteCompanyCategory(id);
        return deletedMessage;
    }

    @Get(':id')
    //@Auth()
    @ApiOperation({ summary: "Получить информацию о категории компании" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: CompanyCategoryAnswerDTO })
    async getById (@Param('id') id: string): Promise<CompanyCategoryAnswerDTO> {
        const companyCategory = await this.companyCategoriesService.getCompanyCategoryById(id);
        return companyCategory;
    }

    @Get()
    //@Auth()
    @ApiOkResponse({ type: CompanyCategoryAnswerDTO, isArray: true })
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

        const companyCategories = await this.companyCategoriesService.getAllCompanyCategoriesByFilter(paginate, filters);
        return companyCategories;
    }
}
