import { deleteFileComment } from "../repository/fileRepository";

export interface DeleteFileCommentProps {
	userId: string;
	fileId: string;
	commentId: string;
}

export const deleteFileCommentUsecase = async ({
	userId,
	fileId,
	commentId,
}: DeleteFileCommentProps) => {
	console.log("deleteFileCommentUsecase start");
	const result = await deleteFileComment({ userId, fileId, commentId });
	return result;
};
