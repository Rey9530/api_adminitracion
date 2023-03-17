/*
  Warnings:

  - You are about to alter the column `impuesto` on the `GeneralData` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "GeneralData" ALTER COLUMN "impuesto" SET DATA TYPE DOUBLE PRECISION;
