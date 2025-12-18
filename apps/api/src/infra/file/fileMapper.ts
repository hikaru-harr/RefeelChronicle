import type { File as DomainFile } from "../../features/files/entity/File";
import type { Prisma } from "../../generated/prisma/client";

type PrismaFile = Prisma.FileGetPayload<Prisma.FileDefaultArgs>;

export function toDomainFile(row: PrismaFile): DomainFile {
	return {
		id: row.id,
		userId: row.userId,
		objectKey: row.objectKey,
		mime: row.mime,
		bytes: row.bytes,
		kind: row.kind,
		isFavorite: row.isFavorite,
		previewObjectKey: row.previewObjectKey,
		createdAt: row.createdAt,
	};
}

export function toDomainFiles(rows: PrismaFile[]): DomainFile[] {
	return rows.map(toDomainFile);
}
