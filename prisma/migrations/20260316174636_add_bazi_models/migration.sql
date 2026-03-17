-- CreateTable
CREATE TABLE "BaziReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "result" TEXT NOT NULL,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BaziReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BaziCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthTime" TEXT,
    "gender" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "categories" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "chartData" TEXT NOT NULL,
    "coreAnalysis" TEXT,
    "traits" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "luckPillars" TEXT NOT NULL,
    "faq" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BaziReading_slug_key" ON "BaziReading"("slug");

-- CreateIndex
CREATE INDEX "BaziReading_userId_idx" ON "BaziReading"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BaziCase_slug_key" ON "BaziCase"("slug");
