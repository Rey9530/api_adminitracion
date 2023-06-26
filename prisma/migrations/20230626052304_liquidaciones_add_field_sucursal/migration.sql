/*
  Warnings:

  - Added the required column `id_sucursal` to the `LiquidacionCajaChica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LiquidacionCajaChica" ADD COLUMN     "id_sucursal" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "fk_liquidacion_sucursal_id" ON "LiquidacionCajaChica"("id_sucursal");

-- AddForeignKey
ALTER TABLE "LiquidacionCajaChica" ADD CONSTRAINT "fk_liquidacion_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
