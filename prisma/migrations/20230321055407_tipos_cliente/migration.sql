-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "id_tipo_cliente" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "TiposCliente" (
    "id_tipo_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "TiposCliente_pkey" PRIMARY KEY ("id_tipo_cliente")
);

-- CreateIndex
CREATE INDEX "fk_cliente_tipo_id" ON "Cliente"("id_tipo_cliente");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_tipo" FOREIGN KEY ("id_tipo_cliente") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;
