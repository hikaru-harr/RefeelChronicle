export type File = {
	id: string;
	userId: string;
	objectKey: string;
	mime: string;
	bytes: number;
	kind: "image" | "video" | "other";
	previewObjectKey: string | null;
	createdAt: Date;
};
