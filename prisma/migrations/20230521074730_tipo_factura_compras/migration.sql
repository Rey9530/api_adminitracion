-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "id_tipo_factura" INTEGER DEFAULT 2;

-- CreateIndex
CREATE INDEX "fk_compras_tipo_factura_id" ON "Compras"("id_tipo_factura");

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_tipo_factura" FOREIGN KEY ("id_tipo_factura") REFERENCES "FacturasTipos"("id_tipo_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;
