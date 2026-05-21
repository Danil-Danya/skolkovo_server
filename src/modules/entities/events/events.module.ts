import { Module } from "@nestjs/common";
import { EventController } from "./events.controller";
import { EventService } from "./events.service";
import { NotificationModule } from "../notificatations/notification.module";

@Module({
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
    imports: [NotificationModule]
})
export class EventModule {}