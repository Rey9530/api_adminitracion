-- CreateTable
CREATE TABLE "CuentasClientesDetalle" (
    "id_cuenta_detalle" SERIAL NOT NULL,
    "costo_unitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_cuenta" INTEGER,
    "id_catalogo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CuentasClientesDetalle_pkey" PRIMARY KEY ("id_cuenta_detalle")
);

-- CreateIndex
CREATE INDEX "fk_cuenta_detalle_id" ON "CuentasClientesDetalle"("id_cuenta");

-- CreateIndex
CREATE INDEX "fk_detalle_cuenta_id" ON "CuentasClientesDetalle"("id_catalogo");

-- AddForeignKey
ALTER TABLE "CuentasClientesDetalle" ADD CONSTRAINT "fk_cuenta_detalle" FOREIGN KEY ("id_cuenta") REFERENCES "CuentasClientes"("id_cuenta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CuentasClientesDetalle" ADD CONSTRAINT "fk_detalle_cuenta" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;
