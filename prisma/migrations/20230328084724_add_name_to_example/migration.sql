/*
  Warnings:

  - Added the required column `name` to the `Example` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Example" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Example" ("createdAt", "id", "label", "updatedAt") SELECT "createdAt", "id", "label", "updatedAt" FROM "Example";
DROP TABLE "Example";
ALTER TABLE "new_Example" RENAME TO "Example";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
