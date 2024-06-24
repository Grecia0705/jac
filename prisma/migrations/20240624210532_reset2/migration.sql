-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransactionType" (
    "transactionTypeId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);
INSERT INTO "new_TransactionType" ("createId", "create_at", "delete_at", "description", "name", "transactionTypeId", "update_at") SELECT "createId", "create_at", "delete_at", "description", "name", "transactionTypeId", "update_at" FROM "TransactionType";
DROP TABLE "TransactionType";
ALTER TABLE "new_TransactionType" RENAME TO "TransactionType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
