-- CreateTable
CREATE TABLE "IChingReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageHash" TEXT NOT NULL,
    "intentionTime" DATETIME NOT NULL,
    "lines" TEXT NOT NULL,
    "coins" TEXT NOT NULL,
    "primaryNumber" INTEGER NOT NULL,
    "changedNumber" INTEGER,
    "nuclearNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "analysisMode" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "IChingReading_imageHash_idx" ON "IChingReading"("imageHash");

-- CreateIndex
CREATE INDEX "IChingReading_createdAt_idx" ON "IChingReading"("createdAt");
