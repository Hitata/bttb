-- AlterTable
ALTER TABLE "BaziClient" ADD COLUMN "birthPlace" TEXT;
ALTER TABLE "BaziClient" ADD COLUMN "latitude" REAL;
ALTER TABLE "BaziClient" ADD COLUMN "longitude" REAL;
ALTER TABLE "BaziClient" ADD COLUMN "timezone" TEXT;

-- CreateTable
CREATE TABLE "HumanDesignClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "birthTimeUnknown" BOOLEAN NOT NULL DEFAULT false,
    "birthPlace" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "timezone" TEXT,
    "designType" TEXT,
    "chartSummary" TEXT,
    "fullChart" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baziClientId" TEXT,
    "tuViClientId" TEXT,
    "hdClientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientProfile_baziClientId_fkey" FOREIGN KEY ("baziClientId") REFERENCES "BaziClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ClientProfile_tuViClientId_fkey" FOREIGN KEY ("tuViClientId") REFERENCES "TuViClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ClientProfile_hdClientId_fkey" FOREIGN KEY ("hdClientId") REFERENCES "HumanDesignClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClientProfile" ("baziClientId", "createdAt", "id", "name", "tuViClientId", "updatedAt") SELECT "baziClientId", "createdAt", "id", "name", "tuViClientId", "updatedAt" FROM "ClientProfile";
DROP TABLE "ClientProfile";
ALTER TABLE "new_ClientProfile" RENAME TO "ClientProfile";
CREATE UNIQUE INDEX "ClientProfile_baziClientId_key" ON "ClientProfile"("baziClientId");
CREATE UNIQUE INDEX "ClientProfile_tuViClientId_key" ON "ClientProfile"("tuViClientId");
CREATE UNIQUE INDEX "ClientProfile_hdClientId_key" ON "ClientProfile"("hdClientId");
CREATE INDEX "ClientProfile_name_idx" ON "ClientProfile"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "HumanDesignClient_name_idx" ON "HumanDesignClient"("name");
