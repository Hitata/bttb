-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baziClientId" TEXT,
    "tuViClientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientProfile_baziClientId_fkey" FOREIGN KEY ("baziClientId") REFERENCES "BaziClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ClientProfile_tuViClientId_fkey" FOREIGN KEY ("tuViClientId") REFERENCES "TuViClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "sessionId" TEXT,
    "maxMessages" INTEGER NOT NULL DEFAULT 10,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadingToken_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadingMessage_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "ReadingToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_baziClientId_key" ON "ClientProfile"("baziClientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_tuViClientId_key" ON "ClientProfile"("tuViClientId");

-- CreateIndex
CREATE INDEX "ClientProfile_name_idx" ON "ClientProfile"("name");

-- CreateIndex
CREATE INDEX "ReadingToken_clientProfileId_idx" ON "ReadingToken"("clientProfileId");

-- CreateIndex
CREATE INDEX "ReadingMessage_tokenId_idx" ON "ReadingMessage"("tokenId");
