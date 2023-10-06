-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('ABIERTA', 'CERRADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Mesas" ADD COLUMN     "id_cuenta" INTEGER;

-- CreateTable
CREATE TABLE "CuentasClientes" (
    "id_cuenta" SERIAL NOT NULL,
    "nombre" TEXT DEFAULT '',
    "nota" TEXT DEFAULT '',
    "numero_clientes" TEXT DEFAULT '0',
    "total" DOUBLE PRECISION DEFAULT 0,
    "estado" "EstadoCuenta" NOT NULL DEFAULT 'ABIERTA',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CuentasClientes_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateIndex
CREATE INDEX "fk_mesa_cuenta_id" ON "Mesas"("id_cuenta");

-- AddForeignKey
ALTER TABLE "Mesas" ADD CONSTRAINT "fk_mesa_cuenta" FOREIGN KEY ("id_cuenta") REFERENCES "CuentasClientes"("id_cuenta") ON DELETE NO ACTION ON UPDATE NO ACTION;
