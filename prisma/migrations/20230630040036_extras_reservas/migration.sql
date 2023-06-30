-- CreateTable
CREATE TABLE "ExtrasReservas" (
    "id_extra" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "ExtrasReservas_pkey" PRIMARY KEY ("id_extra")
);
