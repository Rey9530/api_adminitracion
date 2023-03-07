-- CreateEnum
CREATE TYPE "FacturaTiposDescuentos" AS ENUM ('ITEM', 'GLOBAL', 'AMBOS');

-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "id_descuento" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FacturasDetalle" ADD COLUMN     "id_descuento" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FacturasDescuentos" (
    "id_descuento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descuento" INTEGER NOT NULL,
    "isItem" "FacturaTiposDescuentos" NOT NULL DEFAULT 'AMBOS',
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasDescuentos_pkey" PRIMARY KEY ("id_descuento")
);

-- CreateIndex
CREATE INDEX "fk_fatura_descuento_id" ON "Facturas"("id_descuento");

-- CreateIndex
CREATE INDEX "fk_fatura_detalle_descuento_id" ON "FacturasDetalle"("id_descuento");

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_descuento" FOREIGN KEY ("id_descuento") REFERENCES "FacturasDescuentos"("id_descuento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_fatura_detalle_descuento" FOREIGN KEY ("id_descuento") REFERENCES "FacturasDescuentos"("id_descuento") ON DELETE NO ACTION ON UPDATE NO ACTION;
