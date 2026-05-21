import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { EventStatusScheduler } from "./event-status.scheduler";
import { EventStatusWorkerService } from "./event-status-worker.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        PrismaModule
    ],
    providers: [EventStatusWorkerService, EventStatusScheduler]
})
export class EventStatusWorkerModule {}
