-- CreateTable
CREATE TABLE "GeneralData" (
    "id_general" SERIAL NOT NULL,
    "nombre_sistema" TEXT NOT NULL,
    "impuesto" DECIMAL(65,30) DEFAULT 0.13,

    CONSTRAINT "GeneralData_pkey" PRIMARY KEY ("id_general")
);
