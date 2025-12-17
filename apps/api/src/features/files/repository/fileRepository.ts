import { prisma } from "../../../infra/db/prisma";
import { toDomainFile, toDomainFiles } from "../../../infra/file/fileMapper";
import type { File } from "../entity/File";

export interface CreateFileProps {
	userId: string;
	objectKey: string;
	mime: string;
	bytes: number;
	kind: string;
}

export interface GetFileByIdProps {
	fileId: string;
	userId: string;
}

export async function createFile(props: CreateFileProps): Promise<File> {
	const row = await prisma.file.create({
		data: {
			userId: props.userId,
			objectKey: props.objectKey,
			mime: props.mime,
			bytes: props.bytes,
			kind: props.kind,
		},
	});

	return toDomainFile(row);
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

	return toDomainFiles(rows);
}

export async function getFileById(
	props: GetFileByIdProps,
): Promise<File | null> {
	const row = await prisma.file.findUnique({
		where: { id: props.fileId, userId: props.userId },
	});
	return row ? toDomainFile(row) : null;
}
