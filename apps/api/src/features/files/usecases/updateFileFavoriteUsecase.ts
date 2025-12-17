import { updateFileFavorite } from "../repository/fileRepository";

interface UpdateFileFavoriteUsecaseInput {
	userId: string;
	fileId: string;
	isFavorite: boolean;
}

export const updateFileFavoriteUsecase = async ({ userId, fileId, isFavorite }: UpdateFileFavoriteUsecaseInput): Promise<boolean> => {
	const isUpdated = await updateFileFavorite({ userId, fileId, isFavorite });
    return isUpdated;
}