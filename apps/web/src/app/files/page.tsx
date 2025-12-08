"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUploadFile from "@/features/file/useUploadFile";

function page() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { isUploading, handleSelectFiles, files } = useUploadFile();

	return (
		<div>
			<div className="flex justify-center">
				<Button
					disabled={isUploading}
					onClick={(e) => {
						e.stopPropagation();
						inputRef.current?.click();
					}}
					className="h-12 rounded-full w-12 cursor-pointer absolute bottom-10 right-10 [&_svg:not([class*='size-'])]:size-8"
				>
					{/* {isUploading ? <LoaderCircle className="animate-spin" /> : <Upload />} */}
					<Plus />
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
			<div className="grid grid-cols-3">
				{files.map((file) => (
					<div
						key={file.key}
						className="relative aspect-square overflow-hidden"
					>
						<Image
							src={file.previewUrl}
							alt={file.key}
							fill
							className="object-cover"
							sizes="(min-width: 768px) 33vw, 50vw"
							unoptimized
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default page;
