-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "iva_percivido" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "iva_retenido" DOUBLE PRECISION DEFAULT 0;
