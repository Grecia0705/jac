-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "mount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);
INSERT INTO "new_Transaction" ("categoryId", "createId", "create_at", "date", "delete_at", "description", "mount", "transactionId", "typeId", "update_at") SELECT "categoryId", "createId", "create_at", "date", "delete_at", "description", "mount", "transactionId", "typeId", "update_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_TransactionType" (
    "transactionTypeId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "TransactionType_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransactionType" ("createId", "create_at", "delete_at", "description", "name", "transactionTypeId", "update_at") SELECT "createId", "create_at", "delete_at", "description", "name", "transactionTypeId", "update_at" FROM "TransactionType";
DROP TABLE "TransactionType";
ALTER TABLE "new_TransactionType" RENAME TO "TransactionType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
