-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "id_usuario" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "fk_fatura_usuario_id" ON "Facturas"("id_usuario");

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
