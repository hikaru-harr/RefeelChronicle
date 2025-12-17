import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { CheckedAppEnv } from "../app";
import { compleatUploadUsecase } from "../features/files/usecases/compleatUploadUsecase";
import { createUploadPreSignedUrlUsecase } from "../features/files/usecases/createUploadPreSignedUrlUsecase";
import { getFileUsecase } from "../features/files/usecases/getFileUsecase";
import { listFilesUsecase } from "../features/files/usecases/listFilesUsecase";
import { updateFileFavoriteUsecase } from "../features/files/usecases/updateFileFavoriteUsecase";

export const fileRouter = new Hono<CheckedAppEnv>();

const preSignRequestSchema = z.object({
	fileName: z.string(),
	fileType: z.string(),
});

const compleatRequestSchema = z.object({
	objectKey: z.string(),
	mime: z.string(),
	bytes: z.number(),
});

fileRouter.get("/", async (c) => {
	const { userId } = c.var.currentUser;
	const yearMonth = c.req.query("yearMonth");
	const files = await listFilesUsecase({ userId, yearMonth });
	return c.json({ files }, 200);
});



fileRouter.get("/:id", async (c) => {
	const { userId } = c.var.currentUser;
	const fileId = c.req.param("id");
	const file = await getFileUsecase({ userId, fileId });
	return c.json({ file }, 200);
});

const favoriteRequestSchema = z.object({
	isFavorite: z.boolean(),
});

fileRouter.patch("/:id/favorite", zValidator("json", favoriteRequestSchema), async (c) => {
	const { userId } = c.var.currentUser;
	const fileId = c.req.param("id");
	const { isFavorite } = c.req.valid("json");
	const isUpdated = await updateFileFavoriteUsecase({ userId, fileId, isFavorite });
	return c.json({ isUpdated }, isUpdated ? 200 : 400);
});

fileRouter.post(
	"/pre-sign",
	zValidator("json", preSignRequestSchema),
	async (c) => {
		const { userId } = c.var.currentUser;

		const { fileName, fileType } = c.req.valid("json");

		const { presignedUrl, key } = await createUploadPreSignedUrlUsecase({
			fileName,
			fileType,
			userId: userId,
		});

		return c.json(
			{
				preSignedUrl: presignedUrl,
				objectKey: key,
			},
			200,
		);
	},
);

fileRouter.post(
	"/compleat",
	zValidator("json", compleatRequestSchema),
	async (c) => {
		const { userId } = c.var.currentUser;

		const { objectKey, mime, bytes } = c.req.valid("json");

		const fileWithPreview = await compleatUploadUsecase({
			userId,
			objectKey,
			mime,
			bytes,
		});
		return c.json(fileWithPreview, 201);
	},
);
