"use client";

import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelectedFileStore } from "@/features/file/useSelectedFileStore";
import useUploadFile from "@/features/file/useUploadFile";
import useTimeLine from "@/features/timeLine/useTimeLine";

function page() {
	const setSelectedFile = useSelectedFileStore(
		(state) => state.setSelectedFile,
	);
	const inputRef = useRef<HTMLInputElement | null>(null);

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
					<Link
						key={file.id}
						href={`/files/${file.id}`}
						className="relative aspect-square overflow-hidden"
						onClick={() => setSelectedFile(file)}
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
					</Link>
				))}
			</div>
		</div>
	);
}

export default page;
