import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { buildUserMonthPrefix } from "../domain/filePath";
import { BUCKET_NAME } from "../../../config/env";
import { s3 } from "../../../infra/bucket/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface ListFilesUsecaseInput {
    userId: string;
    yearMonth?: string;
}

interface FileItem {
    key: string;
    previewUrl: string;
}

export const listFilesUsecase = async ({userId, yearMonth}: ListFilesUsecaseInput): Promise<FileItem[]> => {
    // TODO: クエリパラメータで指定の年月があればそちらを無ければデフォルトで現在の年月を取得する
    const prefixDate = yearMonth ? new Date(yearMonth) : new Date();
    const prefix = buildUserMonthPrefix(userId, prefixDate);

    const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
    })

    const listResponse = await s3.send(listCommand);
    const contents = listResponse.Contents ?? [];

    if (contents.length === 0) {
        return [];
    }

    const files: FileItem[] = [];
    for (const obj of contents) {
        const key = obj.Key;
        if (!key) {
            continue;
        }
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });

        const url = await getSignedUrl(s3, getCommand, {
          expiresIn: 3600, // 1時間有効
        });

        files.push({
          key,
          previewUrl: url,
        });
    }
    return files;
} 