-- CreateTable
CREATE TABLE "Hexagram" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameVi" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "nuclearNumber" INTEGER NOT NULL,
    "energyState" TEXT NOT NULL,
    "physicist" TEXT NOT NULL,
    "sage" TEXT NOT NULL,
    "advisor" TEXT NOT NULL,
    "balance" TEXT NOT NULL
);
