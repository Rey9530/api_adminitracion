-- AlterTable
ALTER TABLE "LiquidacionCajaChica" ADD COLUMN     "id_cierre" INTEGER;

-- CreateIndex
CREATE INDEX "fk_liquidacion_cierre_id" ON "LiquidacionCajaChica"("id_cierre");

-- AddForeignKey
ALTER TABLE "LiquidacionCajaChica" ADD CONSTRAINT "fk_liquidacion_cierre" FOREIGN KEY ("id_cierre") REFERENCES "CierresDiarios"("id_cierre") ON DELETE NO ACTION ON UPDATE NO ACTION;
