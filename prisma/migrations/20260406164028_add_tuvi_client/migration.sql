-- CreateTable
CREATE TABLE "HumanDesignReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "birthTimeUnknown" BOOLEAN NOT NULL DEFAULT false,
    "birthPlace" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "timezone" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HumanDesignReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TuViClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER NOT NULL DEFAULT 0,
    "birthMinute" INTEGER NOT NULL DEFAULT 0,
    "birthPlace" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "timezone" TEXT NOT NULL,
    "cucName" TEXT NOT NULL,
    "chartSummary" TEXT NOT NULL,
    "fullChart" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TuViReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "birthPlace" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "timezone" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TuViReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BaziReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
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
INSERT INTO "new_BaziReading" ("birthDay", "birthHour", "birthMinute", "birthMonth", "birthYear", "createdAt", "gender", "id", "isPublic", "name", "result", "slug", "updatedAt", "userId") SELECT "birthDay", "birthHour", "birthMinute", "birthMonth", "birthYear", "createdAt", "gender", "id", "isPublic", "name", "result", "slug", "updatedAt", "userId" FROM "BaziReading";
DROP TABLE "BaziReading";
ALTER TABLE "new_BaziReading" RENAME TO "BaziReading";
CREATE UNIQUE INDEX "BaziReading_slug_key" ON "BaziReading"("slug");
CREATE INDEX "BaziReading_userId_idx" ON "BaziReading"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "HumanDesignReading_slug_key" ON "HumanDesignReading"("slug");

-- CreateIndex
CREATE INDEX "HumanDesignReading_userId_idx" ON "HumanDesignReading"("userId");

-- CreateIndex
CREATE INDEX "TuViClient_name_idx" ON "TuViClient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TuViReading_slug_key" ON "TuViReading"("slug");

-- CreateIndex
CREATE INDEX "TuViReading_userId_idx" ON "TuViReading"("userId");
