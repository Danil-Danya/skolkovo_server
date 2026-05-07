import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UploadFile } from "src/core/decorators/upload_file.decorator";
import type { UploadedStaticFile } from "src/core/types/files.type";
import { CompanyService } from "./company.service";
import {
    CompanyAnswerDTO,
    CompanyDTO,
    CreateCompanyDTO,
    CreateCompanyWithPreviewDTO,
    UpdateCompanyDTO,
    UpdateCompanyWithPreviewDTO
} from "./dto/company.dto";
import { DeletedMessageDTO, FiltersDTO, PaginateDTO, QueryDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags("Companies")
@Controller("companies")
export class CompaniesController {
    constructor (private companiesService: CompanyService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @UploadFile("preview", "companies")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Создать компанию" })
    @ApiBody({ type: CreateCompanyWithPreviewDTO })
    @ApiOkResponse({ type: CompanyAnswerDTO })
    private async create (
        @Body() data: CreateCompanyWithPreviewDTO,
        @UploadedFile() preview?: UploadedStaticFile
    ): Promise<CompanyAnswerDTO> {
        const { preview: _, ...companyData } = data;

        const createdCompany = await this.companiesService.createCompany({
            ...companyData,
            previewPath: preview?.url ?? data.previewPath
        } as CreateCompanyDTO);

        return createdCompany;
    }

    @Put(":id")
    //@Auth()
    @ApiBearerAuth()
    @UploadFile("preview", "companies")
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Обновить компанию" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiBody({ type: UpdateCompanyWithPreviewDTO })
    @ApiOkResponse({ type: CompanyAnswerDTO })
    private async update (
        @Param("id") id: string,
        @Body() data: UpdateCompanyWithPreviewDTO,
        @UploadedFile() preview?: UploadedStaticFile
    ): Promise<CompanyAnswerDTO> {
        const { preview: _, ...companyData } = data;

        const updatedCompany = await this.companiesService.updateCompany(id, {
            ...companyData,
            previewPath: preview?.url ?? data.previewPath
        } as UpdateCompanyDTO);

        return updatedCompany;
    }

    @Delete(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить компанию" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedCompany = await this.companiesService.deleteCompany(id);
        return deletedCompany;
    }

    @Get(":id")
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить компанию по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: CompanyAnswerDTO })
    private async getOneById (@Param("id") id: string): Promise<CompanyAnswerDTO> {
        const company = await this.companiesService.getOneCompanyById(id);
        return company;
    }

    @Get()
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить список компаний" })
    @ApiOkResponse({ type: CompanyDTO, isArray: true })
    private async getAllByFilters (@Query() query: QueryDTO) {
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

        const companies = await this.companiesService.getAllCompaniesByFilter(paginate, filters);
        return companies;
    }
}
