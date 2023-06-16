-- CreateTable
CREATE TABLE "MotivoSalida" (
    "id_motivo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "MotivoSalida_pkey" PRIMARY KEY ("id_motivo")
);

-- CreateTable
CREATE TABLE "OrdenDeSalida" (
    "id_orden_salida" SERIAL NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "id_motivo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "observacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrdenDeSalida_pkey" PRIMARY KEY ("id_orden_salida")
);

-- CreateTable
CREATE TABLE "OrdenDeSalidaDetalle" (
    "id_orden_detalle" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL DEFAULT 0,
    "id_inventario" INTEGER NOT NULL DEFAULT 0,
    "costo_unitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "OrdenDeSalidaDetalle_pkey" PRIMARY KEY ("id_orden_detalle")
);

-- CreateIndex
CREATE INDEX "fk_salida_bodega_id" ON "OrdenDeSalida"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_salida_motivo_id" ON "OrdenDeSalida"("id_motivo");

-- CreateIndex
CREATE INDEX "fk_salida_usuario_id" ON "OrdenDeSalida"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_salida_detalle_catalogo_id" ON "OrdenDeSalidaDetalle"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_salida_inventario_id" ON "OrdenDeSalidaDetalle"("id_inventario");

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_motivo" FOREIGN KEY ("id_motivo") REFERENCES "MotivoSalida"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalidaDetalle" ADD CONSTRAINT "fk_salida_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalidaDetalle" ADD CONSTRAINT "fk_salida_inventario" FOREIGN KEY ("id_inventario") REFERENCES "Inventario"("id_inventario") ON DELETE NO ACTION ON UPDATE NO ACTION;
