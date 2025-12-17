import { getPreSignedObjectUrl } from "../../../infra/bucket/bucket";
import { listFilesByUserAndMonth } from "../repository/fileRepository";
import { FileKind as PrismaFileKind } from "../../../generated/prisma/enums"
import type { File } from "../entity/File";

interface ListFilesUsecaseInput {
	userId: string;
	yearMonth?: string;
}

export interface FileWithPreview extends File {
	previewUrl: string;
	videoUrl?: string;
}

export const listFilesUsecase = async ({
	userId,
	yearMonth,
}: ListFilesUsecaseInput): Promise<FileWithPreview[]> => {
	const now = new Date();
	const target = yearMonth ? new Date(yearMonth) : now;

	const year = target.getFullYear();
	const month = target.getMonth() + 1;

	const files = await listFilesByUserAndMonth({ userId, year, month });

	const filesWithPreview = await Promise.all(
		files.map(async (file) => {
			const key = file.previewObjectKey ?? file.objectKey;
			const previewUrl = await getPreSignedObjectUrl(key);
			let videoUrl: string | undefined;
			if (file.kind === PrismaFileKind.video) {
				videoUrl = await getPreSignedObjectUrl(file.objectKey);
			}
			return {
				...file,
				previewUrl,
				videoUrl,
			};
		}),
	);
	return filesWithPreview;
};
