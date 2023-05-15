-- CreateEnum
CREATE TYPE "EstadoAgenda" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Agenda" (
    "id_agenda" SERIAL NOT NULL,
    "zona" TEXT,
    "id_sucursal" INTEGER,
    "no_personas" TEXT,
    "nombre" TEXT,
    "telefono" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "nota" TEXT,
    "id_usuario" INTEGER,
    "estado" "EstadoAgenda" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id_agenda")
);

-- CreateIndex
CREATE INDEX "fk_agenda_sucursal_id" ON "Agenda"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_agenda_usuario_id" ON "Agenda"("id_usuario");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "fk_agenda_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "fk_agenda_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
