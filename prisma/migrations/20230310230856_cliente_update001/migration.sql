/*
  Warnings:

  - You are about to drop the column `rozon_social` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "rozon_social",
ADD COLUMN     "razon_social" TEXT DEFAULT '';
