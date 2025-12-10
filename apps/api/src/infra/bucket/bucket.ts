import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
	BUCKET_ACCESS_KEY,
	BUCKET_ENDPOINT,
	BUCKET_NAME,
	BUCKET_REGION,
	BUCKET_SECRET_KEY,
} from "../../config/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
	region: BUCKET_REGION,
	endpoint: BUCKET_ENDPOINT,
	forcePathStyle: true,
	requestChecksumCalculation: "WHEN_REQUIRED",
	credentials: {
		accessKeyId: BUCKET_ACCESS_KEY,
		secretAccessKey: BUCKET_SECRET_KEY,
	},
});

export const getPreSignedObjectUrl = async (key:string): Promise<string> => {
	const getObjectCommand = new GetObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	const url = await getSignedUrl(s3, getObjectCommand, {
		expiresIn: 3600, // 1時間有効
	});

	return url;
}