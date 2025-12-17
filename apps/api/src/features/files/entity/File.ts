import type { FileKind as PrismaFileKind } from "../../../generated/prisma/enums";

export type File = {
	id: string;
	userId: string;
	objectKey: string;
	mime: string;
	bytes: number;
	kind: PrismaFileKind;
	previewObjectKey: string | null;
	isFavorite: boolean;
	createdAt: Date;
};
