import type { File as DomainFile } from "../../features/files/entity/File";
import type { FileComment, Prisma } from "../../generated/prisma/client";

type PrismaFileWithComments = Prisma.FileGetPayload<{
	include: { fileComments: true };
}>;

function toDomainFileComment(
	row: PrismaFileWithComments["fileComments"][number],
): FileComment {
	return {
		id: row.id,
		userId: row.userId,
		fileId: row.fileId,
		comment: row.comment,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

export function toDomainFile(row: PrismaFileWithComments): DomainFile {
	return {
		id: row.id,
		userId: row.userId,
		objectKey: row.objectKey,
		mime: row.mime,
		bytes: row.bytes,
		kind: row.kind,
		isFavorite: row.isFavorite,
		previewObjectKey: row.previewObjectKey,
		originalObjectKey: row.originalObjectKey,
		createdAt: row.createdAt,
		contentHash: row.contentHash,

		fileComments: row.fileComments.map(toDomainFileComment),
	};
}

export function toDomainFiles(rows: PrismaFileWithComments[]): DomainFile[] {
	return rows.map(toDomainFile);
}
