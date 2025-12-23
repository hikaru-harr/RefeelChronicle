import { useEffect, useState } from "react";
import { favorite, getDetail } from "../api/files";
import type { FileItem } from "./useUploadFile";

interface Props {
	id?: string;
	file?: FileItem;
}

export const useDetailFile = ({ id, file }: Props) => {
	const [detailFile, setDetailFile] = useState<FileItem | null>(file ?? null);
	const handleFavorite = async () => {
		if (!detailFile) return;
		const result = await favorite({
			id: detailFile.id,
			isFavorite: !detailFile.isFavorite,
		});
		if (!result) {
			console.error(`PATCH /files/${detailFile.id}/favorite`);
			return;
		}
		const updatedFile = { ...detailFile, isFavorite: !detailFile.isFavorite };
		setDetailFile(updatedFile);
	};

	useEffect(() => {
		const requestId = file?.id ?? id;
		if (!requestId) return;
		const init = async () => {
			const response = await getDetail(requestId);
			if (!response) {
				console.error(`GET /files/${id}`);
				return;
			}
			setDetailFile(response);
		};
		init();
	}, [id, file]);

	return {
		handleFavorite,
		detailFile,
	};
};