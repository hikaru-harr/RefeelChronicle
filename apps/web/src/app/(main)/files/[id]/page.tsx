"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectedFileStore } from "@/features/file/useSelectedFileStore";
import type { FileItem } from "@/features/file/useUploadFile";
import { useLogger } from "@/lib/context/LoggerContext";

export default function Page() {
	const router = useRouter();
	const { id } = useParams<{ id: string }>();
	const { logInfo, logError } = useLogger();

	const cached = useSelectedFileStore((s) =>
		id ? s.selectedFileById[id] : undefined,
	);
	const setSelectedFile = useSelectedFileStore((s) => s.setSelectedFile);

	const [detailFile, setDetailFile] = useState<FileItem | null>(null);

	useEffect(() => {
		if (!id) return;
		setDetailFile(cached ?? null);
	}, [id, cached]);

	useEffect(() => {
		if (!id) {
			router.back();
			return;
		}

		const controller = new AbortController();

		const init = async () => {
			try {
				logInfo(`GET /files/${id} start`);

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_TARGET}/api/files/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("jwtToken") ?? ""}`,
						},
						signal: controller.signal,
					},
				);

				if (!res.ok) {
					logError(`GET /files/${id} error: ${res.status}`);
					router.back();
					return;
				}

				const result = await res.json();
				const file = result.file;

				const response: FileItem = {
					id: file.id,
					userId: file.userId,
					objectKey: file.objectKey,
					mime: file.mime,
					bytes: file.bytes,
					createdAt: file.createdAt,
					previewUrl: file.previewUrl,
					kind: file.kind,
					previewObjectKey: file.previewObjectKey,
					videoUrl: file.videoUrl,
				};

				setDetailFile(response);
				setSelectedFile(response);

				logInfo(`GET /files/${id} success`);
			} catch (error: unknown) {
				logError(`GET /files/${id} ${String(error)}`);
				router.back();
			}
		};
		init();
	}, [id, router, logInfo, logError, setSelectedFile]);

	if (!detailFile) return <div>loading...</div>;

	if (detailFile.kind === "video") {
		if (!detailFile.videoUrl) return <div>loading...</div>;
	} else {
		if (!detailFile.previewUrl) return <div>loading...</div>;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="relative w-[100vw] h-[calc(100vh-12rem)]">
				{detailFile.kind === "video" ? (
					// biome-ignore lint/a11y/useMediaCaption: 開発中のためキャプションは後で追加予定
					<video controls src={detailFile.videoUrl ?? undefined} />
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
	);
}
