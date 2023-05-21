/*
  Warnings:

  - You are about to drop the `Cierres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cierres" DROP CONSTRAINT "fk_cierre_sucursal";

-- DropForeignKey
ALTER TABLE "Cierres" DROP CONSTRAINT "fk_cierre_usuario";

-- DropTable
DROP TABLE "Cierres";

-- CreateTable
CREATE TABLE "CierresDiarios" (
    "id_cierre" SERIAL NOT NULL,
    "venta_bruta" DOUBLE PRECISION DEFAULT 0,
    "para_llevar" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_credomatic" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_serfinza" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_promerica" DOUBLE PRECISION DEFAULT 0,
    "bitcoin" DOUBLE PRECISION DEFAULT 0,
    "syke" DOUBLE PRECISION DEFAULT 0,
    "total_restante" DOUBLE PRECISION DEFAULT 0,
    "propina" DOUBLE PRECISION DEFAULT 0,
    "venta_nota_sin_iva" DOUBLE PRECISION DEFAULT 0,
    "cortecia" DOUBLE PRECISION DEFAULT 0,
    "anti_cobrados" DOUBLE PRECISION DEFAULT 0,
    "anti_reservas" DOUBLE PRECISION DEFAULT 0,
    "certificado_regalo" DOUBLE PRECISION DEFAULT 0,
    "hugo_app" DOUBLE PRECISION DEFAULT 0,
    "pedidos_ya" DOUBLE PRECISION DEFAULT 0,
    "compras" DOUBLE PRECISION DEFAULT 0,
    "entrega_efectivo" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,
    "id_usuario" INTEGER,
    "id_sucursal" INTEGER,

    CONSTRAINT "CierresDiarios_pkey" PRIMARY KEY ("id_cierre")
);

-- CreateIndex
CREATE INDEX "fk_cierre_sucursal_id" ON "CierresDiarios"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_cierre_usuario_id" ON "CierresDiarios"("id_usuario");

-- AddForeignKey
ALTER TABLE "CierresDiarios" ADD CONSTRAINT "fk_cierre_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CierresDiarios" ADD CONSTRAINT "fk_cierre_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
