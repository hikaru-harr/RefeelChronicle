"use client";

import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDetailView } from "@/features/file/FileDetailView";
import useUploadFile, { type FileItem } from "@/features/file/useUploadFile";
import useTimeLine from "@/features/timeLine/useTimeLine";

function page() {
	const router = useRouter();
	const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const { yearMonthParam, label, handlePrevMonth, handleNextMonth, canGoNext } =
		useTimeLine();

	const { isUploading, handleSelectFiles, files } = useUploadFile({
		yearMonthParam,
	});

	const previewFile = (file: FileItem) => {
		setSelectedFile(file);
		window.history.pushState(null, "", `/files/${file.id}`);
	};

	useEffect(() => {
		window.addEventListener("popstate", () => setSelectedFile(null));
		return () =>
			window.removeEventListener("popstate", () => setSelectedFile(null));
	}, []);

	const closeModal = () => {
		router.push("/files");
		setSelectedFile(null);
	};

	return (
		<div>
			{selectedFile && (
				<FileDetailView file={selectedFile} onClose={() => closeModal()} />
			)}
			<div className="flex items-center justify-between gap-4 w-full">
				<Button variant="ghost" onClick={handlePrevMonth}>
					<ChevronLeft />
				</Button>
				<span>{label}</span>
				{canGoNext ? (
					<Button variant="ghost" onClick={handleNextMonth}>
						<ChevronRight />
					</Button>
				) : (
					<Button variant="ghost" disabled>
						<ChevronRight />
					</Button>
				)}
			</div>
			<div className="flex justify-center mt-2">
				<Button
					disabled={isUploading}
					onClick={(e) => {
						e.stopPropagation();
						inputRef.current?.click();
					}}
					className="h-[80px] rounded-full w-[80px] cursor-pointer absolute bottom-20 right-20 [&_svg:not([class*='size-'])]:size-8 z-30"
				>
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
					<button
						key={file.id}
						type="button"
						onClick={() => previewFile(file)}
						className="relative aspect-square overflow-hidden"
					>
						<Image
							src={file.previewUrl}
							alt={file.objectKey}
							fill
							className="object-cover"
							sizes="(min-width: 768px) 33vw, 50vw"
							unoptimized
						/>

						{file.kind === "video" && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/20">
								<div className="w-9 h-9 rounded-full bg-black/70 flex items-center justify-center">
									<Play stroke="white" fill="white" />
								</div>
							</div>
						)}
					</button>
				))}
			</div>
		</div>
	);
}

export default page;
