import type { File } from "../entity/File";
import { type CreateFileProps, createFile } from "../repository/fileRepository";

export const compleatUploadUsecase = async (
	props: CreateFileProps,
): Promise<File> => {
	return await createFile(props);
};
