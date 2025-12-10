import { prisma } from "../../../infra/db/prisma";
import { toDomainFile } from "../../../infra/file/fileMapper";
import type { File } from "../entity/File";


export interface CreateFileProps {
    userId: string;
    objectKey: string;
    mime: string;
    bytes: number;
}


export async function createFile(props: CreateFileProps): Promise<File> {
  const row = await prisma.file.create({
    data: {
      userId: props.userId,
      objectKey: props.objectKey,
      mime: props.mime,
      bytes: props.bytes,
    },
  });

  return toDomainFile(row);
}