-- CreateTable
CREATE TABLE "Bancos" (
    "id_banco" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "Estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Bancos_pkey" PRIMARY KEY ("id_banco")
);
