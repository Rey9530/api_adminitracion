/*
  Warnings:

  - Added the required column `id_usuario` to the `Cheques` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheques" ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "fk_cheque_usuario_id" ON "Cheques"("id_usuario");

-- AddForeignKey
ALTER TABLE "Cheques" ADD CONSTRAINT "fk_cheque_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
