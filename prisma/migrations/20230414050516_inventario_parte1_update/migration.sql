/*
  Warnings:

  - You are about to drop the column `direccion` on the `Compras` table. All the data in the column will be lost.
  - You are about to drop the column `giro` on the `Compras` table. All the data in the column will be lost.
  - You are about to drop the column `nit` on the `Compras` table. All the data in the column will be lost.
  - You are about to drop the column `no_registro` on the `Compras` table. All the data in the column will be lost.
  - You are about to drop the column `proveedor` on the `Compras` table. All the data in the column will be lost.
  - The `tipo_pago` column on the `Compras` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clase` column on the `Compras` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `costo` on the `Inventario` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Inventario` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('CONTADO', 'CREDITO');

-- CreateEnum
CREATE TYPE "ClaseFactura" AS ENUM ('IMPRENTAOTICKETS', 'FROMUNICO', 'FACELECTRONICA');

-- AlterTable
ALTER TABLE "Compras" DROP COLUMN "direccion",
DROP COLUMN "giro",
DROP COLUMN "nit",
DROP COLUMN "no_registro",
DROP COLUMN "proveedor",
DROP COLUMN "tipo_pago",
ADD COLUMN     "tipo_pago" "TipoPago" NOT NULL DEFAULT 'CONTADO',
DROP COLUMN "clase",
ADD COLUMN     "clase" "ClaseFactura" NOT NULL DEFAULT 'IMPRENTAOTICKETS';

-- AlterTable
ALTER TABLE "Inventario" DROP COLUMN "costo",
DROP COLUMN "total",
ADD COLUMN     "costo_total" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "costo_unitario" DOUBLE PRECISION DEFAULT 0;
