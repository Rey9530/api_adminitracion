/*
  Warnings:

  - The `tipo_inventario` column on the `Compras` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoInventario" AS ENUM ('MP', 'CI');

-- AlterTable
ALTER TABLE "Compras" DROP COLUMN "tipo_inventario",
ADD COLUMN     "tipo_inventario" "TipoInventario" DEFAULT 'MP';
