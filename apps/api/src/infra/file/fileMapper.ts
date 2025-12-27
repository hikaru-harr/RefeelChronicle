import type { File as DomainFile } from "../../features/files/entity/File";
import type { FileComment, Prisma } from "../../generated/prisma/client";

interface PrismaFileWithComments
	extends Prisma.FileGetPayload<{
		include: { fileComments: true };
	}> {}

interface FileCommentWithDelete extends FileComment {
	canDelete: boolean;
}

export function toDomainFileComment(
	row: PrismaFileWithComments["fileComments"][number],
	currentUserId: string,
): FileComment & FileCommentWithDelete {
	const isDelete = currentUserId === row.userId;
	return {
		id: row.id,
		userId: row.userId,
		fileId: row.fileId,
		comment: row.comment,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,

		canDelete: isDelete,
	};
}

export function toDomainFile(
	row: PrismaFileWithComments,
	currentUserId: string,
): DomainFile {
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

		fileComments: row.fileComments.map((comment) =>
			toDomainFileComment(comment, currentUserId),
		),
	};
}

export function toDomainFiles(
	rows: PrismaFileWithComments[],
	currentUserId: string,
): DomainFile[] {
	return rows.map((row) => toDomainFile(row, currentUserId));
}
