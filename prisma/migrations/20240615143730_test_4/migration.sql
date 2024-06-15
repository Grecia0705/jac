/*
  Warnings:

  - You are about to drop the column `machineId` on the `Control` table. All the data in the column will be lost.
  - You are about to drop the column `rawmatterId` on the `Control` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Control" (
    "controlId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "gr" INTEGER NOT NULL,
    "createId" TEXT NOT NULL,
    CONSTRAINT "Control_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Control" ("controlId", "createId", "date", "gr", "kg") SELECT "controlId", "createId", "date", "gr", "kg" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
