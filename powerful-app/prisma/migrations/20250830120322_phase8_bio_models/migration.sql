-- CreateTable
CREATE TABLE "BioMode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BioSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modeKey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "symbol" TEXT,
    "score" REAL,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BioMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modeKey" TEXT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BioMode_key_key" ON "BioMode"("key");
