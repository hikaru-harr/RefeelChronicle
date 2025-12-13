import type { File } from "../../features/files/entity/File";
import type { Prisma } from "../../generated/prisma/client";

type PrismaFile = Prisma.FileGetPayload<Prisma.FileDefaultArgs>;

export function toDomainFile(row: PrismaFile): File {
	return {
		id: row.id,
		userId: row.userId,
		objectKey: row.objectKey,
		mime: row.mime,
		bytes: row.bytes,
		kind: row.kind,
		previewObjectKey: row.previewObjectKey,
		createdAt: row.createdAt,
	};
}

export function toDomainFiles(rows: PrismaFile[]): File[] {
	return rows.map(toDomainFile);
}
