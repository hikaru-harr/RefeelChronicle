import { updateFileComment } from "../repository/fileRepository";

export interface UpdateFileCommentProps {
	userId: string;
	fileId: string;
	comment: string;
}

export const updateFileCommentUsecase = async ({
	userId,
	fileId,
	comment,
}: UpdateFileCommentProps) => {
	console.log("updateFileCommentUsecase start");
	const result = await updateFileComment({ userId, fileId, comment });
	return result;
};
