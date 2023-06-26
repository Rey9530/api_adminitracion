/*
  Warnings:

  - Made the column `id_cierre` on table `LiquidacionCajaChica` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LiquidacionCajaChica" ALTER COLUMN "id_cierre" SET NOT NULL,
ALTER COLUMN "id_cierre" SET DEFAULT 0;
