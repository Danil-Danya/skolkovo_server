import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { EVENT_STATUSES } from "../types/event-status.type";

type UpdateEventStatusesResult = {
    createdCount: number;
    processedCount: number;
    endedCount: number;
    totalCount: number;
};

@Injectable()
export class EventStatusWorkerService {
    constructor (private prisma: PrismaService) {}

    async updateEventStatuses(): Promise<UpdateEventStatusesResult> {
        const now = new Date();

        const [createdEvents, processedEvents, endedEvents] = await this.prisma.$transaction([
            this.prisma.events.updateMany({
                where: {
                    startTime: {
                        gt: now
                    },
                    status: {
                        notIn: [
                            EVENT_STATUSES.CANCELED,
                            EVENT_STATUSES.CREATED
                        ]
                    }
                },
                data: {
                    status: EVENT_STATUSES.CREATED
                }
            }),
            this.prisma.events.updateMany({
                where: {
                    startTime: {
                        lte: now
                    },
                    endTime: {
                        gt: now
                    },
                    status: {
                        notIn: [
                            EVENT_STATUSES.CANCELED,
                            EVENT_STATUSES.PROCESSED
                        ]
                    }
                },
                data: {
                    status: EVENT_STATUSES.PROCESSED
                }
            }),
            this.prisma.events.updateMany({
                where: {
                    endTime: {
                        lte: now
                    },
                    status: {
                        notIn: [
                            EVENT_STATUSES.CANCELED,
                            EVENT_STATUSES.ENDED
                        ]
                    }
                },
                data: {
                    status: EVENT_STATUSES.ENDED
                }
            })
        ]);

        return {
            createdCount: createdEvents.count,
            processedCount: processedEvents.count,
            endedCount: endedEvents.count,
            totalCount: createdEvents.count + processedEvents.count + endedEvents.count
        };
    }
}
