// apps/api/src/infra/db/prisma.ts

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client";

const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

// Prisma 7 では adapter 経由で DB に接続する
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: ["query", "error", "warn"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
