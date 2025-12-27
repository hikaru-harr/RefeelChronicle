-- CreateTable
CREATE TABLE "FileComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileComment_fileId_createdAt_idx" ON "FileComment"("fileId", "createdAt");

-- CreateIndex
CREATE INDEX "FileComment_userId_createdAt_idx" ON "FileComment"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "FileComment" ADD CONSTRAINT "FileComment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
