export const EVENT_STATUSES = {
    CREATED: "CREATED",
    PROCESSED: "PROCESSED",
    CANCELED: "CANCELED",
    ENDED: "ENDED"
} as const;

export const EVENT_STATUS_VALUES = Object.values(EVENT_STATUSES);

export type EventStatus = (typeof EVENT_STATUSES)[keyof typeof EVENT_STATUSES];
