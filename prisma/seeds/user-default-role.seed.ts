import type { PrismaClient } from "@prisma/client";

export async function seedUsersDefaultRole (prisma: PrismaClient): Promise<void> {
    const role = await prisma.roles.upsert({
        where: {
            name: "USER"
        },
        update: {},
        create: {
            name: "USER"
        }
    });

    const users = await prisma.users.findMany({
        where: {
            deletedAt: null,
            roles: {
                none: {}
            }
        },
        select: {
            id: true
        }
    });

    if (!users.length) {
        console.log("[seed] All active users already have roles");
        return;
    }

    await prisma.user_roles.createMany({
        data: users.map(({ id }) => ({
            userId: id,
            roleId: role.id
        }))
    });

    console.log(`[seed] Assigned USER role to ${users.length} users without roles`);
}
