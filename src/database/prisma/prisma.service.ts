import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const getRequiredEnv = (name: string): string => {
    const value = process.env[name];

    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

const getDatabaseConfig = () => {
    const port = Number(getRequiredEnv("DB_PORT"));

    if (Number.isNaN(port)) {
        throw new Error("DB_PORT must be a valid number");
    }

    return {
        host: getRequiredEnv("DB_HOST"),
        port,
        user: getRequiredEnv("DB_SERVERNAME"),
        password: getRequiredEnv("DB_PASSWORD"),
        database: getRequiredEnv("DB_NAME")
    };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const adapter = new PrismaPg(getDatabaseConfig());
        super({ adapter });
    }

    public async onModuleInit() {
        await this.$connect();
    }

    public async onModuleDestroy() {
        await this.$disconnect();
    }
}
