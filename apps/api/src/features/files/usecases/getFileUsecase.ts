import { getPreSignedObjectUrl } from "../../../infra/bucket/bucket";
import { getFileById } from "../repository/fileRepository";

interface GetFileUsecaseInput {
	userId: string;
	fileId: string;
}

export const getFileUsecase = async ({
	userId,
	fileId,
}: GetFileUsecaseInput) => {
	const file = await getFileById({ userId, fileId });
	if (!file) {
		throw new Error("File not found");
	}
	const key = file.previewObjectKey ?? file.objectKey;
	const previewUrl = await getPreSignedObjectUrl(key);
	let videoUrl: string | undefined;
	if (file.kind === "video") {
		videoUrl = await getPreSignedObjectUrl(file.objectKey);
	}
	return {
		...file,
		previewUrl,
		videoUrl,
	};
};
