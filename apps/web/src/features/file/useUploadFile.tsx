import { useEffect, useRef, useState } from "react";
import { buildThumbForUpload } from "@/features/file/imageThumb";
import { useLogger } from "@/lib/context/LoggerContext";
import { uploadFileCompleat } from "../api/files/compleat";
import { getFiles } from "../api/files/getFiles";
import { getPreSignedUrl } from "../api/files/pre-sign";
import { uploadFile } from "../api/files/upload";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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
	fileId: string;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
	canDelete: boolean;
}

export interface DetailFile extends FileItem {
	fileComments: FileComment[];
}

interface Props {
	yearMonthParam: string;
}

const useUploadFile = ({ yearMonthParam }: Props) => {
	const { logError } = useLogger();

	const completeCount = useRef<number>(0);
	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);

	const handleSelectFiles = async (files: FileList | File[]) => {
		setIsUploading(true);
		const id = uuidv4();
		const fileList = Array.from(files);
		console.log(fileList);
		if (fileList.length === 0) {
			// TODO: エラー表示
			logError(`handleSelectFiles error: ${fileList.length}`);
			return;
		}
		const uploadFileList: FileItem[] = [];
		for (const file of fileList) {
			toast(
				`${completeCount.current}/${fileList.length} アップロードが完了しました。`,
				{ id },
			);
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
				// TODO: エラー表示
				logError(`originalUploadOk error: ${originalPresign.objectKey}`);
				continue;
			}

			if (!thumbForUpload) {
				logError("サムネイルの作成に失敗しました。");
				setIsUploading(false);
				continue;
			}
			const thumbPresign = await getPreSignedUrl(thumbForUpload);

			if (!thumbPresign) {
				logError("サムネイルのアップロードに失敗しました。");
				setIsUploading(false);
				continue;
			}
			const thumbUploadOk = await uploadFile(
				thumbPresign.preSignedUrl,
				thumbForUpload,
			);
			if (!thumbUploadOk) {
				logError(`thumbUploadOk error: ${thumbPresign.objectKey}`);
				setIsUploading(false);
				continue;
			}

			const compleatResult = await uploadFileCompleat({
				objectKey: originalPresign.objectKey,
				previewObjectKey: thumbPresign.objectKey,
				mime: originalForUpload.type,
				bytes: originalForUpload.size,
				kind: isImage ? "image" : isVideo ? "video" : "other",
			});

			uploadFileList.push(compleatResult);
			completeCount.current++;
		}

		setFiles((prev) => [...uploadFileList, ...prev]);

		setIsUploading(false);
		toast.success("アップロードが完了しました。", { id });
		completeCount.current = 0;
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
