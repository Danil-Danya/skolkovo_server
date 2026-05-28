import { Prisma } from "@prisma/client";

export const USER_SELECT = Prisma.validator<Prisma.usersSelect>()({
    id: true,
    tgChatId: true,
    tgUserName: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    profile: {
        select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            avatarPath: true,
            biography: true,
            gender: true,
            education: true,
            region: true,
            tgUser: true,
            phone: true,
            companyLinks: {
                select: {
                    company: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            position: {
                select: {
                    name: true
                }
            }
        }
    },

    roles: {
        select: {
            role: true
        }
    }
});
