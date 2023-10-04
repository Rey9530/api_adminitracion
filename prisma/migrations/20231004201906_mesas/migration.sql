-- CreateEnum
CREATE TYPE "Ubicacion" AS ENUM ('PrimerPiso', 'SegundoPiso', 'Terraza');

-- CreateTable
CREATE TABLE "Mesas" (
    "id_mesa" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "ubicacion" "Ubicacion" NOT NULL DEFAULT 'PrimerPiso',
    "id_sucursal" INTEGER NOT NULL,

    CONSTRAINT "Mesas_pkey" PRIMARY KEY ("id_mesa")
);

-- CreateIndex
CREATE INDEX "fk_mesa_sucursal_id" ON "Mesas"("id_sucursal");

-- AddForeignKey
ALTER TABLE "Mesas" ADD CONSTRAINT "fk_mesa_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
