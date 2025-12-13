"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUploadFile, { type FileItem } from "@/features/file/useUploadFile";
import useTimeLine from "@/features/timeLine/useTimeLine";

function page() {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [detailFile, setDetailFile] = useState<FileItem | null>(null);

	const { yearMonthParam, label, handlePrevMonth, handleNextMonth, canGoNext } =
		useTimeLine();

	const { isUploading, handleSelectFiles, files } = useUploadFile({
		yearMonthParam,
	});

	return (
		<div>
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
			{detailFile && (
				<Dialog open={!!detailFile} onOpenChange={() => setDetailFile(null)}>
					<DialogContent className="h-screen w-screen" showCloseButton={false}>
						<DialogHeader className="relative h-12 items-center justify-center z-50">
							<Button
								variant="ghost"
								onClick={() => setDetailFile(null)}
								className="absolute left-4"
							>
								<ArrowLeft />
							</Button>
							<DialogTitle>Detail</DialogTitle>
						</DialogHeader>
						<div className="fixed inset-0 flex items-center justify-center">
							<div className="relative w-[100vw] h-[calc(100vh-12rem)]">
								{detailFile.kind === "video" ? (
									<video controls src={detailFile.videoUrl} />
								) : (
									<Image
										src={detailFile.previewUrl}
										alt={detailFile.objectKey}
										fill
										className="object-contain"
										sizes="80vw"
										unoptimized
									/>
								)}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
			<div className="flex justify-center mt-2">
				<Button
					disabled={isUploading}
					onClick={(e) => {
						e.stopPropagation();
						inputRef.current?.click();
					}}
					className="h-12 rounded-full w-12 cursor-pointer absolute bottom-10 right-10 [&_svg:not([class*='size-'])]:size-8"
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
						className="relative aspect-square overflow-hidden"
						type="button"
						onClick={() => setDetailFile(file)}
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
