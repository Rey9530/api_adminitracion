/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Inventario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventario" DROP COLUMN "cantidad",
ADD COLUMN     "existencia" DOUBLE PRECISION DEFAULT 0;
