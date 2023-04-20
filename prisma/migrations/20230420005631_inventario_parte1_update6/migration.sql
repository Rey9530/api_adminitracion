-- CreateEnum
CREATE TYPE "TipoCompra" AS ENUM ('INTERNA', 'IMPORTACION');

-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "tipo_compra" "TipoCompra" NOT NULL DEFAULT 'INTERNA';
