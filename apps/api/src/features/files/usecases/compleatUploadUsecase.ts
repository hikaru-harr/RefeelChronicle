import { type CreateFileProps, createFile } from "../repository/fileRepository";
import type { File } from "../entity/File";


export const compleatUploadUsecase = async (props: CreateFileProps): Promise<File> => {
	return await createFile(props);
}