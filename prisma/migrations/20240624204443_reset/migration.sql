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
    "delete_at" DATETIME,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TransactionCategory" ("transactionCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TransactionType" ("transactionTypeId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("categoryId", "createId", "create_at", "date", "delete_at", "description", "mount", "transactionId", "typeId", "update_at") SELECT "categoryId", "createId", "create_at", "date", "delete_at", "description", "mount", "transactionId", "typeId", "update_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
