/*
  Warnings:

  - You are about to drop the column `id_metodo` on the `Facturas` table. All the data in the column will be lost.
  - The primary key for the `FacturasMetodosDePago` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_metodo` on the `FacturasMetodosDePago` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Facturas" DROP CONSTRAINT "fk_fatura_methodo_pago";

-- DropIndex
DROP INDEX "fk_fatura_methodo_pago_id";

-- AlterTable
ALTER TABLE "Facturas" DROP COLUMN "id_metodo",
ADD COLUMN     "id_metodo_pago" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FacturasMetodosDePago" DROP CONSTRAINT "FacturasMetodosDePago_pkey",
DROP COLUMN "id_metodo",
ADD COLUMN     "id_metodo_pago" SERIAL NOT NULL,
ADD CONSTRAINT "FacturasMetodosDePago_pkey" PRIMARY KEY ("id_metodo_pago");

-- CreateIndex
CREATE INDEX "fk_fatura_methodo_pago_id" ON "Facturas"("id_metodo_pago");

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_methodo_pago" FOREIGN KEY ("id_metodo_pago") REFERENCES "FacturasMetodosDePago"("id_metodo_pago") ON DELETE NO ACTION ON UPDATE NO ACTION;
