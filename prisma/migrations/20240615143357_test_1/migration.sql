/*
  Warnings:

  - You are about to drop the column `sello` on the `Control` table. All the data in the column will be lost.
  - Made the column `machineId` on table `Control` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `Control` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rawmatterId` on table `Control` required. This step will fail if there are existing NULL values in that column.

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
    "createId" TEXT NOT NULL,
    CONSTRAINT "Control_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Control_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Control_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("machineId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Control_rawmatterId_fkey" FOREIGN KEY ("rawmatterId") REFERENCES "Rawmater" ("rawmatterId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Control" ("controlId", "createId", "date", "gr", "kg", "machineId", "productId", "rawmatterId") SELECT "controlId", "createId", "date", "gr", "kg", "machineId", "productId", "rawmatterId" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
