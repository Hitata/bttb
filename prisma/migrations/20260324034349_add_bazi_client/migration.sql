-- CreateTable
CREATE TABLE "BaziClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER NOT NULL DEFAULT 0,
    "birthMinute" INTEGER NOT NULL DEFAULT 0,
    "dayMaster" TEXT NOT NULL,
    "chartSummary" TEXT NOT NULL,
    "fullChart" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "BaziClient_name_idx" ON "BaziClient"("name");
