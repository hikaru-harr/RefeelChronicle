import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { CheckedAppEnv } from "../app";
import { createUploadPreSignedUrlUsecase } from "../features/files/usecases/createUploadPreSignedUrlUsecase.ts";

export const fileRouter = new Hono<CheckedAppEnv>();

const preSignRequestSchema = z.object({
	fileName: z.string(),
	fileType: z.string(),
});

fileRouter.post(
	"/pre-sign",
	zValidator("json", preSignRequestSchema),
	async (c) => {
		const {userId} = c.var.currentUser;

		const { fileName, fileType } = c.req.valid("json");

        const {presignedUrl, key} = await createUploadPreSignedUrlUsecase({
            fileName,
            fileType,
            userId: userId,
        });

		return c.json({
			presignedUrl,
            key
		}, 200);
	},
);
