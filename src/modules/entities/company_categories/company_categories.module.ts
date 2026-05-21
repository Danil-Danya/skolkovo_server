import { Module } from "@nestjs/common";
import { CompanyCategoriesService } from "./company_categories.service";
import { CompanyCategoriesController } from "./company_categories.controller";

@Module({
    exports: [CompanyCategoriesService],
    providers: [CompanyCategoriesService],
    controllers: [CompanyCategoriesController]
})
export class CompanyCategoriesModule {}