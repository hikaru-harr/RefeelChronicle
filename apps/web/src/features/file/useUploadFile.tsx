import { useEffect, useState } from "react";
import { useLogger } from "@/lib/context/LoggerContext";
import { buildThumbForUpload } from "@/features/file/imageThumb";
import { getPreSignedUrl } from "../api/files/pre-sign";
import { uploadFile } from "../api/files/upload";
import { uploadFileCompleat } from "../api/files/compleat";
import { getFiles } from "../api/files/getFiles";

export interface FileItem {
	id: string;
	userId: string;
	objectKey: string;
	mime: string;
	bytes: number;
	createdAt: Date;
	previewUrl: string;
	kind: "image" | "video" | "other";
	previewObjectKey: string;
	isFavorite: boolean;
	originalObjectKey?: string;
	videoUrl?: string;
}

export interface FileComment {
	id: string;
	userId: string;
	fileId: string;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface DetailFile extends FileItem {
	fileComments: FileComment[];
}

interface Props {
	yearMonthParam: string;
}

const useUploadFile = ({ yearMonthParam }: Props) => {
	const { logInfo, logError } = useLogger();

	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);

	const handleSelectFiles = async (files: FileList | File[]) => {
		setIsUploading(true);
		const fileList = Array.from(files);
		console.log(fileList);
		if (fileList.length === 0) {
			// TODO: エラー表示
			logError(`handleSelectFiles error: ${fileList.length}`);
			return;
		}
		const uploadFileList: FileItem[] = [];
		for (const file of fileList) {
			const isImage =
				file.type.startsWith("image/") ||
				file.name.toLowerCase().endsWith(".heic") ||
				file.name.toLowerCase().endsWith(".heif");
			const isVideo = file.type.startsWith("video/");

			let originalForUpload = file;
			let thumbForUpload: File | null = null;

			if (isImage) {
				const built = await buildThumbForUpload(file);
				originalForUpload = built.normalizedOriginal;
				thumbForUpload = built.thumb;
			}

			const originalPresign = await getPreSignedUrl(originalForUpload);
			if (!originalPresign) {
				continue;
			}

			const originalUploadOk = await uploadFile(
				originalPresign.preSignedUrl,
				originalForUpload,
			);
			if (!originalUploadOk) {
				continue;
			}

			let previewObjectKey = originalPresign.objectKey;
			if (thumbForUpload) {
				const thumbPresign = await getPreSignedUrl(thumbForUpload);
				if (thumbPresign) {
					const thumbUploadOk = await uploadFile(
						thumbPresign.preSignedUrl,
						thumbForUpload,
					);
					if (thumbUploadOk) previewObjectKey = thumbPresign.objectKey;
				}
			}

			const compleatResult = await uploadFileCompleat({
				objectKey: originalPresign.objectKey,
				previewObjectKey,
				mime: originalForUpload.type,
				bytes: originalForUpload.size,
				kind: isImage ? "image" : isVideo ? "video" : "other",
			});

			uploadFileList.push(compleatResult);
		}

		setFiles((prev) => [...uploadFileList, ...prev]);

		setIsUploading(false);
	};

	useEffect(() => {
		const init = async () => {
			const result = await getFiles(yearMonthParam);
			console.log(result);
			setFiles(result);
		};
		init();
	}, [yearMonthParam]);

	return {
		files,
		isUploading,
		handleSelectFiles,
	};
};

export default useUploadFile;
