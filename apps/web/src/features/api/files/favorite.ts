import { api } from "@/lib/api";

interface Props {
    id: string;
    isFavorite: boolean;
}

interface Result {
    isUpdated: boolean;
}
export const favorite = async ({id, isFavorite}: Props): Promise<boolean> => {
    console.log(`PATCH /files/${id}/favorite start`);
    const result = await api.patch<Result>(`/api/files/${id}/favorite`, { isFavorite });
    if (!result) {
        console.error(`PATCH /files/${id}/favorite error: ${String(result)}`);
        return false;
    }
    return true;
}