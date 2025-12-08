import { useEffect, useState } from "react";

interface FileItem {
	key: string;
	previewUrl: string;
}

const useUploadFile = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);

	const getPreSignedUrl = async (file: File) => {
		try {
			const url = await fetch("http://localhost:3000/api/files/pre-sign", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
				},
				body: JSON.stringify({
					fileName: file.name,
					fileType: file.type,
				}),
			});
			const data = await url.json();
			return data.presignedUrl;
		} catch (error) {
			console.error("getPreSignedUrl error", error);
			return null;
		}
	};

	const uploadFile = async (preSignedUrl: string, file: File) => {
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
			const preSignedUrl = await getPreSignedUrl(file);
			if (!preSignedUrl) {
				flag = false;
				errorList.push({
					fileName: file.name,
					error: "Failed to get pre-signed URL",
				});
				continue;
			}
			const uploadResult = await uploadFile(preSignedUrl, file);
			if (!uploadResult) {
				flag = false;
				errorList.push({
					fileName: file.name,
					error: "Failed to upload file",
				});
				continue;
			}
			uploadFileList.push({
				key: file.name,
				previewUrl: URL.createObjectURL(file),
			});
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
			const result = await fetch("http://localhost:3000/api/files", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("jwtToken"),
				},
			});
			const data = await result.json();
			setFiles(data.files);
		};
		init();
	}, []);

	return {
		files,
		isUploading,
		handleSelectFiles,
	};
};

export default useUploadFile;
