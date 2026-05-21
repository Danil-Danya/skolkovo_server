import { Module } from "@nestjs/common";
import { NewsCategoryController } from "./news_category.controller";
import { NewsCategoryService } from "./news_category.service";

@Module({
    controllers: [NewsCategoryController],
    providers: [NewsCategoryService],
    exports: [NewsCategoryService]
})
export class NewsCategoriesModule {}