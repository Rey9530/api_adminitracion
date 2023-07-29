/*
  Warnings:

  - You are about to drop the column `codigo` on the `Cheques` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cheques" DROP COLUMN "codigo",
ALTER COLUMN "no_cheque" DROP NOT NULL;
