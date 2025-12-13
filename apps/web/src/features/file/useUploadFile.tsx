import { useEffect, useState } from "react";

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
}

interface Props {
	yearMonthParam: string;
}

const useUploadFile = ({ yearMonthParam }: Props) => {
	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);

	const getPreSignedUrl = async (
		file: File,
	): Promise<{ preSignedUrl: string; objectKey: string } | null> => {
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
			return await url.json();
		} catch (error) {
			console.error("getPreSignedUrl error", error);
			return null;
		}
	};

	const uploadFile = async (
		preSignedUrl: string,
		file: File,
	): Promise<boolean> => {
		const response = await fetch(preSignedUrl, {
			method: "PUT",
			headers: {
				"Content-Type": file.type,
			},
			body: file,
		});
		if (!response.ok) {
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

			const compleatResult = await fetch(`${process.env.NEXT_PUBLIC_API_TARGET}/api/files/compleat`, {
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
			});
			uploadFileList.push(await compleatResult.json());
		}
		if (!flag) {
			console.log("errorList", errorList);
		}
		setFiles((prev) => [...uploadFileList, ...prev]);

		setIsUploading(false);
	};

	useEffect(() => {
		console.log("useEffect");
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
