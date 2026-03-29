-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IChingReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageHash" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_IChingReading" ("analysisMode", "changedNumber", "coins", "createdAt", "id", "imageHash", "intentionTime", "lines", "nuclearNumber", "primaryNumber", "prompt") SELECT "analysisMode", "changedNumber", "coins", "createdAt", "id", "imageHash", "intentionTime", "lines", "nuclearNumber", "primaryNumber", "prompt" FROM "IChingReading";
DROP TABLE "IChingReading";
ALTER TABLE "new_IChingReading" RENAME TO "IChingReading";
CREATE INDEX "IChingReading_imageHash_idx" ON "IChingReading"("imageHash");
CREATE INDEX "IChingReading_createdAt_idx" ON "IChingReading"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
