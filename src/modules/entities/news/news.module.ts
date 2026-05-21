import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { NotificationModule } from "../notificatations/notification.module";

@Module({
    controllers: [NewsController],
    providers: [NewsService],
    exports: [NewsService],
    imports: [NotificationModule]
})
export class NewsModule {}