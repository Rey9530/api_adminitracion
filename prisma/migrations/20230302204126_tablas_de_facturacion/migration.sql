/*
  Warnings:

  - You are about to drop the column `precio` on the `Catalogo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('ACTIVO', 'ANULADA');

-- AlterTable
ALTER TABLE "Catalogo" DROP COLUMN "precio",
ADD COLUMN     "precio_con_iva" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "precio_sin_iva" DECIMAL(65,30) DEFAULT 0;

-- CreateTable
CREATE TABLE "FacturasTipos" (
    "id_tipo_factura" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasTipos_pkey" PRIMARY KEY ("id_tipo_factura")
);

-- CreateTable
CREATE TABLE "Departamentos" (
    "id_departamento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "Municipios" (
    "id_municipio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "id_departamento" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "Facturas" (
    "id_factura" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL DEFAULT '0',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cliente" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT DEFAULT '',
    "no_registro" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "id_municipio" INTEGER NOT NULL DEFAULT 0,
    "id_tipo_factura" INTEGER NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(10,4),
    "descuento" DECIMAL(10,4),
    "iva" DECIMAL(10,4),
    "total" DECIMAL(10,4),
    "estado" "EstadoFactura" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Facturas_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "FacturasDetalle" (
    "id_factura_detalle" SERIAL NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "id_catalogo" INTEGER NOT NULL DEFAULT 0,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_sin_iva" DECIMAL(10,4),
    "precio_con_iva" DECIMAL(10,4),
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(10,4),
    "descuento" DECIMAL(10,4),
    "iva" DECIMAL(10,4),
    "total" DECIMAL(10,4),

    CONSTRAINT "FacturasDetalle_pkey" PRIMARY KEY ("id_factura_detalle")
);

-- CreateIndex
CREATE INDEX "fk_municipio_departamento_id" ON "Municipios"("id_departamento");

-- CreateIndex
CREATE INDEX "fk_fatura_municipio_id" ON "Facturas"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_fatura_tipo_id" ON "Facturas"("id_tipo_factura");

-- CreateIndex
CREATE INDEX "fk_fatura_detalle_id" ON "FacturasDetalle"("id_factura");

-- CreateIndex
CREATE INDEX "fk_factura_detalle_catalogo_id" ON "FacturasDetalle"("id_catalogo");

-- AddForeignKey
ALTER TABLE "Municipios" ADD CONSTRAINT "fk_municipio_departamento" FOREIGN KEY ("id_departamento") REFERENCES "Departamentos"("id_departamento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_tipo" FOREIGN KEY ("id_tipo_factura") REFERENCES "FacturasTipos"("id_tipo_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_fatura_detalle" FOREIGN KEY ("id_factura") REFERENCES "Facturas"("id_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_factura_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;
