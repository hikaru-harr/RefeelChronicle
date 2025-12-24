import { api } from "@/lib/api";

interface Props {
    id: string;
    comment: string;
}

interface Result {
    isUpdated: boolean;
}
export const comment = async ({id, comment}: Props): Promise<boolean> => {
    console.log(`PATCH /files/${id}/comment start`);
    const result = await api.post<Result>(`/api/files/${id}/comment`, { comment });
    if (!result) {
        console.error(`PATCH /files/${id}/comment error: ${String(result)}`);
        return false;
    }
    return true;
}