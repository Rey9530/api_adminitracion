-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "cheque" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "credito" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "efectivo" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "id_metodo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tarjeta" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "transferencia" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "FacturasMetodosDePago" (
    "id_metodo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasMetodosDePago_pkey" PRIMARY KEY ("id_metodo")
);

-- CreateIndex
CREATE INDEX "fk_fatura_methodo_pago_id" ON "Facturas"("id_metodo");

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_methodo_pago" FOREIGN KEY ("id_metodo") REFERENCES "FacturasMetodosDePago"("id_metodo") ON DELETE NO ACTION ON UPDATE NO ACTION;
