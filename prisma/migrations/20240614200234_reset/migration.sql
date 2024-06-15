/*
  Warnings:

  - Added the required column `code` to the `Rawmater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Rawmater` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rawmater" (
    "rawmatterId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createId" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "gr" INTEGER NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Rawmater_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rawmater" ("createId", "create_at", "delete_at", "description", "gr", "kg", "name", "rawmatterId", "update_at") SELECT "createId", "create_at", "delete_at", "description", "gr", "kg", "name", "rawmatterId", "update_at" FROM "Rawmater";
DROP TABLE "Rawmater";
ALTER TABLE "new_Rawmater" RENAME TO "Rawmater";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
