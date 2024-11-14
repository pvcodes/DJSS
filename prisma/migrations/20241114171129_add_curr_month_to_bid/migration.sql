/*
  Warnings:

  - You are about to drop the column `total_bidcount` on the `ChitFund` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ChitFund` DROP COLUMN `total_bidcount`,
    ADD COLUMN `last_bidMonth` INTEGER NOT NULL DEFAULT 0;
