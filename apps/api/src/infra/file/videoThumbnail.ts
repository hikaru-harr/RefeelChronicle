import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { BUCKET_NAME } from "../../config/env";
import { s3 } from "../bucket/bucket";
import { createReadStream, createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

const streamPipeline = promisify(pipeline);

async function runFfmpeg(args: string[]): Promise<void> {
    const ffmpegPath = ffmpeg.path;
    return new Promise<void>((resolve, reject) => {
        const child = spawn(ffmpegPath, args, {
            stdio: "inherit",
        })

        child.on("error", (err) => {
            reject(err)}
        );

        child.on("close", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`FFmpeg process exited with code ${code}`))
            }
        })
    });
}

export async function generateVideoThumbnail(objectKey: string): Promise<string> {
	const getCommand = new GetObjectCommand({
		Bucket: BUCKET_NAME,
		Key: objectKey,
	});

    const res = await s3.send(getCommand);
    const body = res.Body as unknown as NodeJS.ReadableStream;
    if (!body) {
        throw new Error("Failed to get object");
    }

    const tmpVideoPath = join(tmpdir(), `video_${Date.now()}.mp4`);
    const thumbnailPath = join(tmpdir(), `thumbnail_${Date.now()}.jpg`);

    await streamPipeline(body, createWriteStream(tmpVideoPath));

    await runFfmpeg([
        "-y",
        "-ss",
        "00:00:01",
        "-i",
        tmpVideoPath,
        "-frames:v",
        "1",
        "-vf",
        "scale=640:-1",
        thumbnailPath,
    ])

    const thumbKey = objectKey.replace(/(\.\w+)?$/, ".jpg");

    const putCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: thumbKey,
        Body: createReadStream(thumbnailPath),
        ContentType: "image/jpeg",
    })

    await s3.send(putCommand);

    return thumbKey
}