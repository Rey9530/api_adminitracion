/*
  Warnings:

  - You are about to drop the column `precio_con_iva` on the `ComprasDetalle` table. All the data in the column will be lost.
  - You are about to drop the column `precio_sin_iva` on the `ComprasDetalle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ComprasDetalle" DROP COLUMN "precio_con_iva",
DROP COLUMN "precio_sin_iva",
ADD COLUMN     "costo_unitario" DOUBLE PRECISION DEFAULT 0;
