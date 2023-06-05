-- AlterTable
ALTER TABLE "Proveedores" ADD COLUMN     "id_banco" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "no_cuenta" TEXT DEFAULT '',
ADD COLUMN     "tipo_cuenta" TEXT DEFAULT '';

-- CreateIndex
CREATE INDEX "fk_proveedor_banco_id" ON "Proveedores"("id_banco");

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_banco" FOREIGN KEY ("id_banco") REFERENCES "Bancos"("id_banco") ON DELETE NO ACTION ON UPDATE NO ACTION;
