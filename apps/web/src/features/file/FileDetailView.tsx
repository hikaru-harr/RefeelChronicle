"use client";

import { format } from "date-fns";
import {
	ChevronLeft,
	Loader,
	MessageCircleMore,
	Star,
	Tag,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { FileItem } from "@/features/file/useUploadFile";
import { useDetailFile } from "./useDetailFile";

export function FileDetailView({
	file,
	onClose,
	id,
}: {
	file?: FileItem;
	onClose: () => void;
	id?: string;
}) {
	const { detailFile, handleFavorite } = useDetailFile({ id, file });

	if (!detailFile)
		return (
			<div className="animate-spin">
				<Loader />
			</div>
		);

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
			<div className="absolute inset-x-0 bottom-0 mx-auto h-[100dvh] max-w-3xl shadow-lg">
				<div className="h-12 w-full bg-white grid grid-cols-[48px_1fr_48px] items-center border-b sticky top-0 z-50">
					<div className="justify-self-start">
						<Button variant="ghost" onClick={onClose} className="h-12 w-12 p-0">
							<ChevronLeft />
						</Button>
					</div>

					<p className="justify-self-center text-center truncate">
						{format(new Date(detailFile.createdAt), "yyyy年MM月dd日")}
					</p>

					<div className="justify-self-end" />
				</div>

				{detailFile.kind === "video" ? (
					// biome-ignore lint/a11y/useMediaCaption: 開発中のためキャプションは後で追加予定
					<video
						controls
						preload="metadata"
						src={detailFile.videoUrl ?? undefined}
					/>
				) : (
					<Image
						src={detailFile.previewUrl}
						alt={detailFile.objectKey}
						fill
						className="object-contain"
						sizes="100vw"
						unoptimized
						loading="eager"
					/>
				)}
			</div>

			<div className="absolute bottom-20 right-10 flex flex-col space-y-4 items-center justify-center">
				<button
					type="button"
					onClick={handleFavorite}
					className="h-12 w-12 rounded-full bg-black flex items-center justify-center"
				>
					<Star
						fill={detailFile.isFavorite ? "yellow" : "black"}
						stroke={detailFile.isFavorite ? "yellow" : "white"}
						className="h-6 w-6"
					/>
				</button>

				<button
					type="button"
					className="h-12 w-12 rounded-full bg-black flex items-center justify-center"
				>
					<Tag fill="black" stroke="white" className="h-6 w-6" />
				</button>

				<button
					type="button"
					className="h-12 w-12 rounded-full bg-black flex items-center justify-center"
				>
					<MessageCircleMore fill="black" stroke="white" className="h-6 w-6" />
				</button>
			</div>
		</div>
	);
}
