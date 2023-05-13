/*
  Warnings:

  - You are about to alter the column `existencia` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "numero_quedan" TEXT DEFAULT '0';

-- AlterTable
ALTER TABLE "Inventario" ALTER COLUMN "existencia" SET DEFAULT 0,
ALTER COLUMN "existencia" SET DATA TYPE INTEGER;
