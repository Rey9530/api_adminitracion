-- AlterTable
ALTER TABLE "GeneralData" ADD COLUMN     "id_tipo_contribuyente" INTEGER;

-- CreateIndex
CREATE INDEX "fk_sistema_tipo_id" ON "GeneralData"("id_tipo_contribuyente");

-- AddForeignKey
ALTER TABLE "GeneralData" ADD CONSTRAINT "fk_sistema_tipo" FOREIGN KEY ("id_tipo_contribuyente") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;
