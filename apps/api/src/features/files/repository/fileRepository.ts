import type { FileKind as PrismaFileKind } from "../../../generated/prisma/enums";
import { prisma } from "../../../infra/db/prisma";
import { toDomainFile, toDomainFiles } from "../../../infra/file/fileMapper";
import type { File, FileComment } from "../entity/File";
import type { DeleteFileCommentProps } from "../usecases/deleteFileCommentUsecase";
import type { UpdateFileCommentProps } from "../usecases/updateFileCommentUsecase";

export interface CreateFileProps {
	userId: string;
	objectKey: string;
	previewObjectKey: string;
	mime: string;
	bytes: number;
	kind: PrismaFileKind;
	contentHash?: string;
}

export interface GetFileByIdProps {
	fileId: string;
	userId: string;
}

export async function createFile(props: CreateFileProps): Promise<File> {
	const row = await prisma.file.upsert({
		where: {
			objectKey: props.objectKey,
		},
		create: {
			userId: props.userId,
			objectKey: props.objectKey,
			originalObjectKey: props.objectKey,
			previewObjectKey: props.previewObjectKey,
			mime: props.mime,
			bytes: props.bytes,
			kind: props.kind,
			contentHash: props.contentHash ?? null,
		},
		update: {
			userId: props.userId,
			previewObjectKey: props.previewObjectKey,
			mime: props.mime,
			bytes: props.bytes,
			kind: props.kind,
			contentHash: props.contentHash ?? null,
		},
	});

	return toDomainFile({ ...row, fileComments: [] });
}

export async function setFilePreviewObjectKey(
	fileId: string,
	previewObjectKey: string,
): Promise<void> {
	await prisma.file.update({
		where: { id: fileId },
		data: { previewObjectKey },
	});
}

export interface ListFilesByUserAndMonthProps {
	userId: string;
	month: number;
	year: number;
}

export async function listFilesByUserAndMonth(
	props: ListFilesByUserAndMonthProps,
): Promise<File[]> {
	const start = new Date(props.year, props.month - 1, 1);
	const end = new Date(props.year, props.month, 1);

	const rows = await prisma.file.findMany({
		where: {
			userId: props.userId,
			createdAt: {
				gte: start,
				lt: end,
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return toDomainFiles(rows.map((row) => ({ ...row, fileComments: [] })));
}

export async function getFileById(
	props: GetFileByIdProps,
): Promise<File | null> {
	const row = await prisma.file.findUnique({
		where: { id: props.fileId, userId: props.userId },
		include: {
			fileComments: true,
		},
	});
	return row ? toDomainFile(row) : null;
}

export interface UpdateFileFavoriteProps {
	fileId: string;
	userId: string;
	isFavorite: boolean;
}

export async function updateFileFavorite(
	props: UpdateFileFavoriteProps,
): Promise<boolean> {
	try {
		await prisma.file.update({
			where: { id: props.fileId, userId: props.userId },
			data: { isFavorite: props.isFavorite },
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function updateFileComment(
	props: UpdateFileCommentProps,
): Promise<FileComment | null> {
	try {
		const result = await prisma.fileComment.create({
			data: {
				fileId: props.fileId,
				userId: props.userId,
				comment: props.comment,
			},
		});
		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function deleteFileComment(
	props: DeleteFileCommentProps,
): Promise<boolean> {
	try {
		await prisma.fileComment.delete({
			where: { id: props.commentId },
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
