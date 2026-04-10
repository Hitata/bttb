-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaziReading" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaziReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanDesignReading" (
    "id" TEXT NOT NULL,
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
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HumanDesignReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaziCase" (
    "id" TEXT NOT NULL,
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
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaziCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "IChingReading" (
    "id" TEXT NOT NULL,
    "imageHash" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
    "intentionTime" TIMESTAMP(3) NOT NULL,
    "lines" TEXT NOT NULL,
    "coins" TEXT NOT NULL,
    "primaryNumber" INTEGER NOT NULL,
    "changedNumber" INTEGER,
    "nuclearNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL DEFAULT '',
    "analysisMode" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IChingReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaziClient" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaziClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hexagram" (
    "number" INTEGER NOT NULL,
    "nameVi" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "nuclearNumber" INTEGER NOT NULL,
    "energyState" TEXT NOT NULL,
    "physicist" TEXT NOT NULL,
    "sage" TEXT NOT NULL,
    "advisor" TEXT NOT NULL,
    "balance" TEXT NOT NULL,

    CONSTRAINT "Hexagram_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "TuViClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER NOT NULL DEFAULT 0,
    "birthMinute" INTEGER NOT NULL DEFAULT 0,
    "birthPlace" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "cucName" TEXT NOT NULL,
    "chartSummary" TEXT NOT NULL,
    "fullChart" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuViClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuViReading" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "birthPlace" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "slug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuViReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baziClientId" TEXT,
    "tuViClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingToken" (
    "id" TEXT NOT NULL,
    "clientProfileId" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "sessionId" TEXT,
    "maxMessages" INTEGER NOT NULL DEFAULT 10,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingMessage" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BaziReading_slug_key" ON "BaziReading"("slug");

-- CreateIndex
CREATE INDEX "BaziReading_userId_idx" ON "BaziReading"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HumanDesignReading_slug_key" ON "HumanDesignReading"("slug");

-- CreateIndex
CREATE INDEX "HumanDesignReading_userId_idx" ON "HumanDesignReading"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BaziCase_slug_key" ON "BaziCase"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "IChingReading_imageHash_idx" ON "IChingReading"("imageHash");

-- CreateIndex
CREATE INDEX "IChingReading_createdAt_idx" ON "IChingReading"("createdAt");

-- CreateIndex
CREATE INDEX "BaziClient_name_idx" ON "BaziClient"("name");

-- CreateIndex
CREATE INDEX "TuViClient_name_idx" ON "TuViClient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TuViReading_slug_key" ON "TuViReading"("slug");

-- CreateIndex
CREATE INDEX "TuViReading_userId_idx" ON "TuViReading"("userId");

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

-- AddForeignKey
ALTER TABLE "BaziReading" ADD CONSTRAINT "BaziReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanDesignReading" ADD CONSTRAINT "HumanDesignReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuViReading" ADD CONSTRAINT "TuViReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_baziClientId_fkey" FOREIGN KEY ("baziClientId") REFERENCES "BaziClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_tuViClientId_fkey" FOREIGN KEY ("tuViClientId") REFERENCES "TuViClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingToken" ADD CONSTRAINT "ReadingToken_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingMessage" ADD CONSTRAINT "ReadingMessage_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "ReadingToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
