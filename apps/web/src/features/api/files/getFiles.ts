import type { FileItem } from "@/features/file/useUploadFile";
import { api } from "@/lib/api";

export const getFiles = async (yearMonthParam: string): Promise<FileItem[]> => {
    console.log(`getFiles start ${process.env.NEXT_PUBLIC_API_TARGET}/api/files`);
	const result = await api.get("/api/files", {
        params: { yearMonth: yearMonthParam },
    });
    if(!result.data){
        return []
    }
	return result.data.files
}