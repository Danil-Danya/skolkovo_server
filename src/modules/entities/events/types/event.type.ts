import { Prisma, EventRegistrationStatus } from '@prisma/client';

const ACTIVE_REGISTRATION_STATUSES = [
    EventRegistrationStatus.PENDING,
    EventRegistrationStatus.APPROVED
];

export const eventAnswerInclude = Prisma.validator<Prisma.eventsInclude>()({
    author: {
        select: {
            profile: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    },
    location: {
        select: {
            name: true,
            address: true,
            lat: true,
            long: true,
            yandexLink: true
        }
    },
    registrations: {
        where: {
            status: {
                in: ACTIVE_REGISTRATION_STATUSES
            }
        },
        include: {
            user: {
                include: {
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    },
    _count: {
        select: {
            registrations: {
                where: {
                    status: {
                        in: ACTIVE_REGISTRATION_STATUSES
                    }
                }
            }
        }
    }
});