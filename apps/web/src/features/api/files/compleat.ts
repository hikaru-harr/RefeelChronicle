import { api } from "@/lib/api";

interface Props {
	objectKey: string;
	previewObjectKey: string;
	mime: string;
	bytes: number;
	kind: string;
}

export const uploadFileCompleat = async ({
	objectKey,
	previewObjectKey,
	mime,
	bytes,
	kind,
}: Props) => {
    const compleatResult = await api.post(
        `/api/files/compleat`,
        {
            objectKey,
            previewObjectKey,
            mime,
            bytes,
            kind,
        },
    );
    return compleatResult.data;
}