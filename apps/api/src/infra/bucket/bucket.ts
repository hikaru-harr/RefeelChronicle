import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    endpoint: process.env.BUCKET_ENDPOINT,
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
    },
});