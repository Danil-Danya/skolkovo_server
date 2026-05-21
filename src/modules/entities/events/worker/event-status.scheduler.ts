import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EventStatusWorkerService } from "./event-status-worker.service";

@Injectable()
export class EventStatusScheduler implements OnModuleInit {
    private readonly logger = new Logger(EventStatusScheduler.name);

    constructor(
        private readonly eventStatusWorkerService: EventStatusWorkerService
    ) {}

    async onModuleInit() {
        await this.syncStatuses("Первичная");
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleHourlyUpdate() {
        await this.syncStatuses("Ежечасная");
    }

    private async syncStatuses (label: string) {
        this.logger.log(`${label} синхронизация статусов мероприятий запущена`);

        const updatedEvents = await this.eventStatusWorkerService.updateEventStatuses();

        this.logger.log(
            `${label} синхронизация статусов мероприятий завершена. Обновлено мероприятий: ${updatedEvents.totalCount} ` +
            `(создано: ${updatedEvents.createdCount}, обработано: ${updatedEvents.processedCount}, завершено: ${updatedEvents.endedCount})`
        );
    }
}
