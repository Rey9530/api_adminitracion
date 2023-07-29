-- AlterTable
ALTER TABLE "Compras" ADD COLUMN     "id_cheque" INTEGER;

-- CreateTable
CREATE TABLE "Cheques" (
    "id_cheque" SERIAL NOT NULL,
    "no_cheque" TEXT NOT NULL,
    "codigo" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Cheques_pkey" PRIMARY KEY ("id_cheque")
);

-- CreateIndex
CREATE INDEX "fk_compras_cheque_id" ON "Compras"("id_cheque");

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_cheque" FOREIGN KEY ("id_cheque") REFERENCES "Cheques"("id_cheque") ON DELETE NO ACTION ON UPDATE NO ACTION;
