/*
  Warnings:

  - You are about to drop the column `id_sucursal` on the `Cierres` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Cierres` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cierres" DROP CONSTRAINT "fk_cierre_sucursal";

-- DropForeignKey
ALTER TABLE "Cierres" DROP CONSTRAINT "fk_cierre_usuario";

-- DropIndex
DROP INDEX "fk_cierre_sucursal_id";

-- DropIndex
DROP INDEX "fk_cierre_usuario_id";

-- AlterTable
ALTER TABLE "Cierres" DROP COLUMN "id_sucursal",
DROP COLUMN "id_usuario",
ADD COLUMN     "id_su" INTEGER,
ADD COLUMN     "id_u" INTEGER;

-- CreateIndex
CREATE INDEX "fk_cierre_sucursal_id" ON "Cierres"("id_su");

-- CreateIndex
CREATE INDEX "fk_cierre_usuario_id" ON "Cierres"("id_u");

-- AddForeignKey
ALTER TABLE "Cierres" ADD CONSTRAINT "fk_cierre_usuario" FOREIGN KEY ("id_u") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cierres" ADD CONSTRAINT "fk_cierre_sucursal" FOREIGN KEY ("id_su") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
