-- CreateTable
CREATE TABLE "AIConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "symbol" TEXT,
    "score" REAL,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AIPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "horizonSec" INTEGER NOT NULL,
    "predictedReturn" REAL NOT NULL,
    "confidence" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AIRiskScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT,
    "timeframe" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AIConfig_key_key" ON "AIConfig"("key");
