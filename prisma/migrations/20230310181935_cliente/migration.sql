/*
  Warnings:

  - Made the column `id_cliente` on table `Facturas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Facturas" ALTER COLUMN "id_cliente" SET NOT NULL,
ALTER COLUMN "id_cliente" DROP DEFAULT;
