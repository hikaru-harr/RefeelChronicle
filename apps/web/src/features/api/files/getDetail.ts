import { api } from "@/lib/api";

export const getDetail = async (id: string) => {
    console.log(`GET /files/${id} start`);
	const result = await api.get(`/api/files/${id}`, {
        params: {
            id,
        },
    });
	if (!result) {
		console.error(`GET /files/${id} error: ${String(result)}`);
		return null;
	}
    return result.data.file;
}