import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seeds/role.seed";
import { seedUsersDefaultRole } from "./seeds/user-default-role.seed";

const getRequiredEnv = (name: string): string => {
    const value = process.env[name];

    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`[seed] Missing required environment variable: ${name}`);
    }

    return value;
};

const getDatabaseConfig = () => {
    const port = Number(getRequiredEnv("DB_PORT"));

    if (Number.isNaN(port)) {
        throw new Error("[seed] DB_PORT must be a number");
    }

    return {
        port,
        host: getRequiredEnv("DB_HOST"),
        user: getRequiredEnv("DB_SERVERNAME"),
        password: getRequiredEnv("DB_PASSWORD"),
        database: getRequiredEnv("DB_NAME")
    };
};

const adapter = new PrismaPg(getDatabaseConfig());
const prisma = new PrismaClient({ adapter });

async function main () {
    await seedRoles(prisma);
    await seedUsersDefaultRole(prisma);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        await prisma.$disconnect();
        console.error("[seed] Failed to seed database");
        console.error(error);
        process.exit(1);
    });
