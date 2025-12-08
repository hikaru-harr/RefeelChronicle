import { S3Client } from "@aws-sdk/client-s3";
import { BUCKET_REGION, BUCKET_ENDPOINT, BUCKET_ACCESS_KEY, BUCKET_SECRET_KEY } from "../../config/env";

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
