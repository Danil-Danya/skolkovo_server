import "dotenv/config";
import { defineConfig } from "prisma/config";

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_SERVERNAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const databaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "node prisma/seed.js",
    },
    datasource: {
        url: databaseUrl,
    },
});
