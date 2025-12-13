-- AlterTable
ALTER TABLE "File" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "previewObjectKey" TEXT;
