-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "id_sucursal" INTEGER;

-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "id_sucursal" INTEGER;

-- AlterTable
ALTER TABLE "FacturasBloques" ADD COLUMN     "id_sucursal" INTEGER;

-- CreateIndex
CREATE INDEX "fk_cliente_sucursal_id" ON "Cliente"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_facturacion_sucursal_id" ON "Facturas"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_sucursal_id" ON "FacturasBloques"("id_sucursal");

-- AddForeignKey
ALTER TABLE "FacturasBloques" ADD CONSTRAINT "fk_fatura_bloque_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_facturacion_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
