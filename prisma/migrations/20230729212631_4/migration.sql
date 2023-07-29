/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailVerified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `image`,
    DROP COLUMN `name`,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `emailVerified` DATETIME(3) NOT NULL;
