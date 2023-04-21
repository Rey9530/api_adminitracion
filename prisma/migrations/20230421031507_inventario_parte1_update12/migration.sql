-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "id_sucursal" INTEGER;

-- CreateIndex
CREATE INDEX "fk_compras_sucursal_id" ON "Compras"("id_sucursal");

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
