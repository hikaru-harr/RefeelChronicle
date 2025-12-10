import type { Prisma } from "../../generated/prisma/client";
import type { File } from "../../features/files/entity/File";

type PrismaFile = Prisma.FileGetPayload<Prisma.FileDefaultArgs>;

export function toDomainFile(row: PrismaFile): File {
  return {
    id: row.id,
    userId: row.userId,
    objectKey: row.objectKey,
    mime: row.mime,
    bytes: row.bytes,
    createdAt: row.createdAt,
  };
}

export function toDomainFiles(rows: PrismaFile[]): File[] {
  return rows.map(toDomainFile);
}