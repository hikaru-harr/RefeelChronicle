/*
  Warnings:

  - The `kind` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('other', 'file', 'video');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "kind",
ADD COLUMN     "kind" "FileKind" NOT NULL DEFAULT 'other';
