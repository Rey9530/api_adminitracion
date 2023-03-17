-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "id_cliente" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "rozon_social" TEXT DEFAULT '',
    "registro_nrc" TEXT DEFAULT '',
    "url_foto_nrc" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "id_municipio" INTEGER DEFAULT 0,
    "direccion" TEXT DEFAULT '',
    "telefono" TEXT DEFAULT '',
    "correo" TEXT DEFAULT '',
    "dui" TEXT DEFAULT '',
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateIndex
CREATE INDEX "fk_cliente_municipio_id" ON "Cliente"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_fatura_cliente_id" ON "Facturas"("id_cliente");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_cliente" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;
