import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { EventStatusWorkerModule } from "./modules/entities/events/worker/event-status-worker.module";

const logger = new Logger("EventStatusWorkerBootstrap");

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(EventStatusWorkerModule);

    app.enableShutdownHooks();

    logger.log("Event status worker started");
}

bootstrap().catch((error) => {
    logger.error(
        error instanceof Error ? error.message : "Event status worker failed to start",
        error instanceof Error ? error.stack : undefined
    );

    process.exit(1);
});
