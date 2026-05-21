import { Module } from "@nestjs/common";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";
import { NotificationModule } from "../notificatations/notification.module";

@Module({
    controllers: [LocationsController],
    providers: [LocationsService],
    exports: [LocationsService],
})
export class LocationsModule {}