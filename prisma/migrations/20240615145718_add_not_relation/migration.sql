/*
  Warnings:

  - Added the required column `machineId` to the `Control` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Control` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawmatterId` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Control" (
    "controlId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "gr" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "rawmatterId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "createId" TEXT NOT NULL
);
INSERT INTO "new_Control" ("controlId", "createId", "date", "gr", "kg") SELECT "controlId", "createId", "date", "gr", "kg" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
