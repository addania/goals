/*
  Warnings:

  - Made the column `completion` on table `Goal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Goal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Goal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "completion" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
