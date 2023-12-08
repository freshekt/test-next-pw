/*
  Warnings:

  - You are about to drop the column `balance` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fromBalance` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBalance` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "balance",
ADD COLUMN     "fromBalance" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "toBalance" DECIMAL(65,30) NOT NULL;
