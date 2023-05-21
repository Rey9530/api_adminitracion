/*
  Warnings:

  - You are about to drop the column `id_su` on the `Cierres` table. All the data in the column will be lost.
  - You are about to drop the column `id_u` on the `Cierres` table. All the data in the column will be lost.

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
ALTER TABLE "Cierres" DROP COLUMN "id_su",
DROP COLUMN "id_u",
ADD COLUMN     "id_sucursal" INTEGER,
ADD COLUMN     "id_usuario" INTEGER;

-- CreateIndex
CREATE INDEX "fk_cierre_sucursal_id" ON "Cierres"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_cierre_usuario_id" ON "Cierres"("id_usuario");

-- AddForeignKey
ALTER TABLE "Cierres" ADD CONSTRAINT "fk_cierre_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cierres" ADD CONSTRAINT "fk_cierre_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
