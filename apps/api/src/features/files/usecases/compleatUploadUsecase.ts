import { getPreSignedObjectUrl } from "../../../infra/bucket/bucket";
import { generateVideoThumbnail } from "../../../infra/file/videoThumbnail";
import type { File } from "../entity/File";
import {
	type CreateFileProps,
	createFile,
	setFilePreviewObjectKey,
} from "../repository/fileRepository";

export interface FileWithPreview extends File {
	previewUrl: string;
	videoUrl?: string;
}

type CompleatInput = Omit<CreateFileProps, "kind">;

export const compleatUploadUsecase = async (
	props: CompleatInput,
): Promise<FileWithPreview> => {
	const kind = props.mime.startsWith("image/")
		? "image"
		: props.mime.startsWith("video/")
			? "video"
			: "other";
	let file = await createFile({ ...props, kind });

	let previewKey = file.objectKey;
	let videoUrl: string | undefined;

	if (kind === "video") {
		try {
			const thumbKey = await generateVideoThumbnail(file.objectKey);
			await setFilePreviewObjectKey(file.id, thumbKey);
			file = { ...file, previewObjectKey: thumbKey };
			previewKey = thumbKey;
			videoUrl = await getPreSignedObjectUrl(file.objectKey);
		} catch (error) {
			console.error(error);
		}
	}
	return {
		...file,
		previewUrl: await getPreSignedObjectUrl(previewKey),
		videoUrl,
	};
};
