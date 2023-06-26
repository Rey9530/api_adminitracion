-- DropForeignKey
ALTER TABLE "LiquidacionCajaChica" DROP CONSTRAINT "fk_liquidacion_cierre";

-- DropIndex
DROP INDEX "fk_liquidacion_cierre_id";
