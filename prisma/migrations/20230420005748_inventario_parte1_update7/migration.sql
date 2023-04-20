-- CreateEnum
CREATE TYPE "TipoCompraFact" AS ENUM ('GRABADO', 'EXCENTO');

-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "tipo_factura" "TipoCompraFact" NOT NULL DEFAULT 'GRABADO';
