"use client";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUploadFile from "@/features/file/useUploadFile";

function page() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { isUploading, handleSelectFiles } = useUploadFile();

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
