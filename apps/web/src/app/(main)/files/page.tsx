"use client";

import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
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
		const onPop = () => setSelectedFile(null);
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
	}, []);

	const closeModal = () => {
		router.push("/files");
		setSelectedFile(null);
	};

	return (
		<div className="h-[100svh] flex flex-col">
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
						const f = e.target.files;
						if (!f) return;
						handleSelectFiles(f);
						e.currentTarget.value = "";
					}}
					type="file"
					className="hidden"
					multiple
					accept="image/*,video/*"
				/>
			</div>

			<div className="flex-1 min-h-0">
				<VirtuosoGrid
					style={{ height: "100%" }}
					totalCount={files.length}
					overscan={600}
					components={{
						List: ({ style, children, ...props }) => (
							<div
								{...props}
								style={style}
								className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0"
							>
								{children}
							</div>
						),
						Item: ({ children, ...props }) => (
							<div
								{...props}
								className="relative aspect-square overflow-hidden"
							>
								{children}
							</div>
						),
					}}
					itemContent={(index) => {
						const file = files[index];
						const isAboveFold = index < 6;
						return (
							<button
								type="button"
								onClick={() => previewFile(file)}
								className="absolute inset-0 w-full h-full"
							>
								<Image
									src={file.previewUrl}
									alt={file.objectKey}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 10vw"
									unoptimized
									loading={isAboveFold ? "eager" : "lazy"}
									priority={isAboveFold}
								/>

								{file.kind === "video" && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/20">
										<div className="w-9 h-9 rounded-full bg-black/70 flex items-center justify-center">
											<Play stroke="white" fill="white" />
										</div>
									</div>
								)}
							</button>
						);
					}}
				/>
			</div>
		</div>
	);
}

export default page;
