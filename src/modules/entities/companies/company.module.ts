import { Module } from "@nestjs/common";
import { CompaniesController } from "./company.controller";
import { CompanyService } from "./company.service";

@Module({
    controllers: [CompaniesController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}