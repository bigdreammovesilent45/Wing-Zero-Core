-- CreateTable
CREATE TABLE "CopyTradeSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leaderStrategyId" TEXT NOT NULL,
    "followerUserId" TEXT,
    "scale" REAL NOT NULL DEFAULT 1.0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CopyTradeExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "leaderStrategyId" TEXT NOT NULL,
    "followerUserId" TEXT,
    "orderId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "size" REAL NOT NULL,
    "pnl" REAL,
    "win" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
