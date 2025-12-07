"use client";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function page() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const getPreSignedUrl = async (file: File) => {
		// TODO: Firebase AuthのJWT付与
		const url = await fetch("/api/files/pre-sign", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fileName: file.name,
				fileType: file.type,
			}),
		});
		const data = await url.json();
		return data;
	};

	const uploadFile = async (file: File) => {
		const preSignedUrl = await getPreSignedUrl(file);
		const response = await fetch(preSignedUrl, {
			method: "PUT",
			body: file,
		});
		if (!response.ok) {
			throw new Error("Failed to upload file");
		}
	};

	const handleSelectFiles = async (files: FileList | File[]) => {
		setIsUploading(true);
		const fileList = Array.from(files);
		console.log(fileList);
		if (fileList.length === 0) {
			// TODO: エラー表示
			return;
		}
		/**
		 * TODO
		 * 1.署名付きURLを取得
		 * 2.ファイルをアップロード
		 */
		for (const file of fileList) {
			await uploadFile(file);
		}

		setIsUploading(false);
	};

	return (
		<div className="flex justify-center">
			<Button
				disabled={isUploading}
				onClick={(e) => {
					e.stopPropagation();
					inputRef.current?.click();
				}}
				className="h-12 rounded-full w-[250px] cursor-pointer"
			>
				{isUploading ? <LoaderCircle className="animate-spin" /> : <Upload />}
				写真をアップロード
			</Button>

			<Input
				ref={inputRef}
				onChange={(e) => {
					const files = e.target.files;
					// TODO: filesがnullの場合エラーにする
					if (files === null) return;
					handleSelectFiles(files);
					e.currentTarget.value = "";
				}}
				type="file"
				className="hidden"
				multiple
				accept="image/*"
			/>
		</div>
	);
}

export default page;
