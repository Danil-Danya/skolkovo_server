import { Module } from "@nestjs/common";
import { EventRegistrationsController } from "./event_registrations.controller";
import { EventRegistrationsService } from "./event_registrations.service";
import { EventService } from "../events/events.service";
import { EventModule } from "../events/events.module";

@Module({
    controllers: [EventRegistrationsController],
    providers: [EventRegistrationsService],
    exports: [EventRegistrationsService],
    imports: [EventModule]
})
export class EventRegistrationsModule {}