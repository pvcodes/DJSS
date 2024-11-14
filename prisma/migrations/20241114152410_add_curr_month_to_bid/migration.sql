/*
  Warnings:

  - You are about to drop the column `curr_month` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `month` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bid` DROP COLUMN `curr_month`,
    ADD COLUMN `month` INTEGER NOT NULL;
