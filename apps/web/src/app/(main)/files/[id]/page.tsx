"use client";
import { useParams, useRouter } from "next/navigation";
import { FileDetailView } from "@/features/file/FileDetailView";

export default function Page() {
	const router = useRouter();
	const { id } = useParams<{ id: string }>();

	return <FileDetailView id={id} onClose={() => router.back()} />;
}
