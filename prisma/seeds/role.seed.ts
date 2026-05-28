import type { PrismaClient } from "@prisma/client";

const roles = [
    { name: "ADMIN" },
    { name: "MANAGER" },
    { name: "USER" }
] as const;

export async function seedRoles (prisma: PrismaClient): Promise<void> {
    for (const role of roles) {
        await prisma.roles.upsert({
            where: {
                name: role.name
            },
            update: {},
            create: role
        });
    }

    console.log(`[seed] Seeded ${roles.length} roles`);
}
