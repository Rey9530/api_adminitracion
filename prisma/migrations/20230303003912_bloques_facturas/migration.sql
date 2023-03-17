/*
  Warnings:

  - You are about to drop the column `id_tipo_factura` on the `Facturas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "fk_fatura_tipo";

-- DropIndex
DROP INDEX "fk_fatura_tipo_id";

-- AlterTable
ALTER TABLE "Facturas" DROP COLUMN "id_tipo_factura",
ADD COLUMN     "id_bloque" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FacturasBloques" (
    "id_bloque" SERIAL NOT NULL,
    "tira" TEXT NOT NULL,
    "desde" INTEGER NOT NULL,
    "hasta" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL,
    "serie" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_tipo_factura" INTEGER NOT NULL DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasBloques_pkey" PRIMARY KEY ("id_bloque")
);

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_tipo_id" ON "FacturasBloques"("id_tipo_factura");

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_id" ON "Facturas"("id_bloque");

-- AddForeignKey
ALTER TABLE "FacturasBloques" ADD CONSTRAINT "fk_fatura_bloque_tipo" FOREIGN KEY ("id_tipo_factura") REFERENCES "FacturasTipos"("id_tipo_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_bloque" FOREIGN KEY ("id_bloque") REFERENCES "FacturasBloques"("id_bloque") ON DELETE NO ACTION ON UPDATE NO ACTION;
