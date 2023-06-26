-- CreateTable
CREATE TABLE "LiquidacionCajaChica" (
    "id_liquidacion" SERIAL NOT NULL,
    "no_correlativo" TEXT,
    "no_comp_de_pago" TEXT,
    "no_comp_registro" TEXT,
    "fecha_inicio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proveedor" TEXT,
    "concepto" TEXT,
    "valor" DOUBLE PRECISION DEFAULT 0,
    "responsable" TEXT,
    "id_usuario" INTEGER NOT NULL,
    "Estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_cierre" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiquidacionCajaChica_pkey" PRIMARY KEY ("id_liquidacion")
);

-- CreateIndex
CREATE INDEX "fk_liquidacion_usuario_id" ON "LiquidacionCajaChica"("id_usuario");

-- AddForeignKey
ALTER TABLE "LiquidacionCajaChica" ADD CONSTRAINT "fk_liquidacion_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
