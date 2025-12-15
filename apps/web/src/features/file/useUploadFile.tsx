import { useEffect, useState } from "react";
import { useLogger } from "@/lib/context/LoggerContext";

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
	videoUrl?: string;
}

interface Props {
	yearMonthParam: string;
}

const useUploadFile = ({ yearMonthParam }: Props) => {
	const { logInfo, logError } = useLogger();

	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);

	const getPreSignedUrl = async (
		file: File,
	): Promise<{ preSignedUrl: string; objectKey: string } | null> => {
		logInfo(
			`getPreSignedUrl start ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/pre-sign`,
		);
		try {
			const url = await fetch(
				`${process.env.NEXT_PUBLIC_API_TARGET}/api/files/pre-sign`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
					},
					body: JSON.stringify({
						fileName: file.name,
						fileType: file.type,
					}),
				},
			);
			logInfo(
				`getPreSignedUrl success ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/pre-sign`,
			);
			return await url.json();
		} catch (error) {
			logError(`getPreSignedUrl error: ${error}`);
			return null;
		}
	};

	const uploadFile = async (
		preSignedUrl: string,
		file: File,
	): Promise<boolean> => {
		logInfo(`uploadFile start ${preSignedUrl}`);

		const response = await fetch(preSignedUrl, {
			method: "PUT",
			headers: {
				"Content-Type": file.type,
			},
			body: file,
		});
		logInfo(`uploadFile success ${preSignedUrl}`);
		if (!response.ok) {
			logError(`uploadFile error ${preSignedUrl}`);
			return false;
		}
		return true;
	};

	const handleSelectFiles = async (files: FileList | File[]) => {
		setIsUploading(true);
		const fileList = Array.from(files);
		console.log(fileList);
		if (fileList.length === 0) {
			// TODO: エラー表示
			logError(`handleSelectFiles error: ${fileList.length}`);
			return;
		}
		let flag = true;
		const errorList = [];
		const uploadFileList: FileItem[] = [];
		for (const file of fileList) {
			const result = await getPreSignedUrl(file);
			if (!result) {
				flag = false;
				errorList.push({
					fileName: file.name,
					error: "Failed to get pre-signed URL",
				});
				continue;
			}
			const uploadResult = await uploadFile(result.preSignedUrl, file);
			if (!uploadResult) {
				flag = false;
				errorList.push({
					fileName: file.name,
					error: "Failed to upload file",
				});
				continue;
			}

			logInfo(
				`compleat start ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/compleat`,
			);
			const compleatResult = await fetch(
				`${process.env.NEXT_PUBLIC_API_TARGET}/api/files/compleat`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
					},
					body: JSON.stringify({
						objectKey: result.objectKey,
						mime: file.type,
						bytes: file.size,
					}),
				},
			);
			logInfo(
				`compleat success ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/compleat`,
			);
			uploadFileList.push(await compleatResult.json());
		}
		if (!flag) {
			logError(`errorList ${errorList}`);
		}
		setFiles((prev) => [...uploadFileList, ...prev]);

		setIsUploading(false);
	};

	useEffect(() => {
		logInfo(
			`GET /files start ${process.env.NEXT_PUBLIC_API_TARGET}/api/files?yearMonth=${yearMonthParam}`,
		);
		const init = async () => {
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_API_TARGET}/api/files?yearMonth=${yearMonthParam}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
					},
				},
			);
			const data = await result.json();
			if (!data) {
				setFiles([]);
				return;
			}
			setFiles(data.files);
			logInfo(`GET /files success yearMonth=${yearMonthParam}`);
		};
		init();
	}, [yearMonthParam, logInfo]);

	return {
		files,
		isUploading,
		handleSelectFiles,
	};
};

export default useUploadFile;
