import type { FileKind as PrismaFileKind } from "../../../generated/prisma/enums";

export type FileComment = {
	id: string;
	fileId: string;
	userId: string;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
};

/**
 * 最終的には写真と動画は同じものはあげれない
 * そのほかのファイルはバージョンとして管理できるようにしたい
 * 置き換えなのか上書きなのか（バージョンを残す）選択できる
 * */
export type File = {
	id: string;
	userId: string;
	objectKey: string;
	mime: string;
	bytes: number;
	kind: PrismaFileKind;
	previewObjectKey: string | null;
	originalObjectKey: string | null;
	isFavorite: boolean;
	contentHash: string | null;
	createdAt: Date;

	fileComments: FileComment[];
};
	