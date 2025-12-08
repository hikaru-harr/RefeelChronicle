import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { zValidator } from "@hono/zod-validator";
import { format } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";
import type { AppEnv } from "../app";
import { s3 } from "../infra/bucket/bucket";

export const fileRouter = new Hono<AppEnv>();

const preSignRequestSchema = z.object({
	fileName: z.string(),
	fileType: z.string(),
});

fileRouter.post(
	"/pre-sign",
	zValidator("json", preSignRequestSchema),
	async (c) => {
		console.log("context", c.var.currentUser);
		const currentUser = c.var.currentUser;
		if (!currentUser) {
			return c.json({
				status: "error",
				message: "User not found",
			});
		}

		const { fileName, fileType } = c.req.valid("json");
		console.log(fileName, fileType);
		const now = new Date();
		const year = format(now, "yyyy");
		const month = format(now, "MM");

		const key = `${currentUser.userId}/${year}/${month}/${fileName}`;

		const command = new PutObjectCommand({
			Bucket: "dev-refeel-chronicle",
			Key: key,
			ContentType: fileType,
		});
		const presignedUrl = await getSignedUrl(s3, command, {
			expiresIn: 300,
		});
		console.log("presignedUrl", presignedUrl);

		c.status(200);
		return c.json({
			presignedUrl,
		});
	},
);
