/*
  Warnings:

  - You are about to drop the column `es_prinicpal` on the `Bodegas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bodegas" DROP COLUMN "es_prinicpal",
ADD COLUMN     "es_principal" INTEGER NOT NULL DEFAULT 0;
