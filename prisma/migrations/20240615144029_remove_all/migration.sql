/*
  Warnings:

  - You are about to drop the column `createId` on the `Control` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Control" (
    "controlId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "gr" INTEGER NOT NULL
);
INSERT INTO "new_Control" ("controlId", "date", "gr", "kg") SELECT "controlId", "date", "gr", "kg" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
