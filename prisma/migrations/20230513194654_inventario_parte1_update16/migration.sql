-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'ENCHEQUE', 'PAGADO');

-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fecha_de_pago" TIMESTAMP(3);
