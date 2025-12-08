import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME } from "../../../config/env";
import { s3 } from "../../../infra/bucket/bucket";
import { buildUserFileKey } from "../domain/filePath";

interface CreateUploadPreSignedUrlInput {
	fileName: string;
	fileType: string;
	userId: string;
	now?: Date;
}

interface CreateUploadPreSignedUrlResult {
	presignedUrl: string;
	key: string;
}

export const createUploadPreSignedUrlUsecase = async ({
	fileName,
	fileType,
	userId,
	now = new Date(),
}: CreateUploadPreSignedUrlInput): Promise<CreateUploadPreSignedUrlResult> => {
	const key = buildUserFileKey(userId, now, fileName);

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		ContentType: fileType,
	});

	const presignedUrl = await getSignedUrl(s3, command, {
		expiresIn: 300,
	});
	return { presignedUrl, key };
};
