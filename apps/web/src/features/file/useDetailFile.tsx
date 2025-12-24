import { useEffect, useState } from "react";
import { favorite, getDetail } from "../api/files";
import type { FileItem } from "./useUploadFile";
import z from "zod";
import { comment } from "../api/files/comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
	id?: string;
	file?: FileItem;
}

export const commentFormSchema = z.object({
	comment: z
		.string()
		.min(1, "コメントを入力してください")
		.max(1000, "コメントは1000文字以内で入力してください"),
});

export type CommentFormType = z.infer<typeof commentFormSchema>;

export const useDetailFile = ({ id, file }: Props) => {
	const commentForm = useForm<CommentFormType>({
		resolver: zodResolver(commentFormSchema),
		defaultValues: {
			comment: "",
		},
	});

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

	const onSubmitComment = async (data: CommentFormType) => {
		if (!detailFile) return;
		const result = await comment({
			id: detailFile.id,
			comment: data.comment,
		});
		if (!result) {
			console.error(`PATCH /files/${detailFile.id}/comment`);
			return;
		}
		const updatedFile = {
			...detailFile,
			fileComments: [...detailFile.fileComments, data.comment],
		};
		setDetailFile(updatedFile);
		commentForm.reset();
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
		onSubmitComment,
		commentForm,
	};
};
