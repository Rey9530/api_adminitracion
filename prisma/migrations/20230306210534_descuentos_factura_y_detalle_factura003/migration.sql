/*
  Warnings:

  - You are about to drop the column `descuento` on the `FacturasDescuentos` table. All the data in the column will be lost.
  - Added the required column `porcentaje` to the `FacturasDescuentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FacturasDescuentos" DROP COLUMN "descuento",
ADD COLUMN     "porcentaje" INTEGER NOT NULL;
