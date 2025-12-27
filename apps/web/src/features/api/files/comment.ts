import type { FileComment } from "@/features/file/useUploadFile";
import { api } from "@/lib/api";

interface Props {
	id: string;
	comment: string;
}

export const comment = async ({
	id,
	comment,
}: Props): Promise<FileComment | null> => {
	console.log(`PATCH /files/${id}/comment start`);
	const result = await api.post<FileComment | null>(
		`/api/files/${id}/comment`,
		{ comment },
	);
	if (!result) {
		console.error(`PATCH /files/${id}/comment error: ${String(result)}`);
		return null;
	}
	return result.data;
};

export const deleteComment = async ({
	id,
	commentId,
}: {
	id: string;
	commentId: string;
}): Promise<boolean> => {
	console.log(`DELETE /files/${id}/comment start`);
	const result = await api.delete<boolean>(
		`/api/files/${id}/comment/${commentId}`,
	);
	if (!result) {
		console.error(`DELETE /files/${id}/comment error: ${String(result)}`);
		return false;
	}
	return true;
};
