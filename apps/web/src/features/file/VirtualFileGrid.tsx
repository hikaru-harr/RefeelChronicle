"use client";

import Image from "next/image";
import { VirtuosoGrid } from "react-virtuoso";
import type { FileItem } from "./useUploadFile";

export function VirtualFileGrid({
	files,
	onSelect,
	isUploading,
	endReached,
}: {
	files: FileItem[];
	onSelect: (file: FileItem) => void;
	isUploading?: boolean;
	endReached?: () => void; // 末尾到達で次ページ取得したいなら
}) {
	return (
		<VirtuosoGrid
			style={{ height: "calc(100vh - 140px)" }} // ヘッダー分引くなど調整
			totalCount={files.length}
			endReached={endReached}
			overscan={600} // 先読み。端末に合わせて調整
			components={{
				List: ({ style, children, ...props }) => (
					<div
						{...props}
						style={style}
						className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 p-2"
					>
						{children}
					</div>
				),
				Item: ({ children, ...props }) => (
					<div
						{...props}
						className="relative w-full aspect-square overflow-hidden rounded"
					>
						{children}
					</div>
				),
				Footer: () =>
					isUploading ? (
						<div className="col-span-full p-4 text-center text-sm opacity-70">
							Uploading...
						</div>
					) : null,
			}}
			itemContent={(index) => {
				const f = files[index];
				// 画像以外（video/other）も混ざるなら分岐してね
				return (
					<button
						type="button"
						onClick={() => onSelect(f)}
						className="absolute inset-0 w-full h-full"
					>
						<Image
							src={f.previewUrl} // ← thumb URL
							alt={f.objectKey}
							fill
							sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 10vw"
							className="object-cover"
							// Next Image最適化を使ってないなら unoptimized を付ける
							// unoptimized
						/>
					</button>
				);
			}}
		/>
	);
}
