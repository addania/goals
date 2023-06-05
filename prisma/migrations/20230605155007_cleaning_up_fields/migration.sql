/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "completedAt",
DROP COLUMN "isCompleted",
DROP COLUMN "updatedAt",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "completion" DROP NOT NULL,
ALTER COLUMN "completion" SET DEFAULT 0,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://i.imgur.com/XKsUTJn.png';
