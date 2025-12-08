import { z } from "zod";

const envSchema = z.object({
	BUCKET_REGION: z.string().min(1),
	BUCKET_ENDPOINT: z.string().min(1),
	BUCKET_ACCESS_KEY: z.string().min(1),
	BUCKET_SECRET_KEY: z.string().min(1),
	BUCKET_NAME: z.string().min(1),
	FIREBASE_PROJECT_ID: z.string().min(1),
});

const _env = envSchema.parse(process.env);

export const BUCKET_REGION = _env.BUCKET_REGION;
export const BUCKET_ENDPOINT = _env.BUCKET_ENDPOINT;
export const BUCKET_ACCESS_KEY = _env.BUCKET_ACCESS_KEY;
export const BUCKET_SECRET_KEY = _env.BUCKET_SECRET_KEY;
export const BUCKET_NAME = _env.BUCKET_NAME;
export const FIREBASE_PROJECT_ID = _env.FIREBASE_PROJECT_ID;
