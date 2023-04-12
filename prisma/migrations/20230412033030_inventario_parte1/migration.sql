-- CreateTable
CREATE TABLE "Bodegas" (
    "id_bodega" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "id_sucursal" INTEGER NOT NULL,

    CONSTRAINT "Bodegas_pkey" PRIMARY KEY ("id_bodega")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "razon_social" TEXT DEFAULT '',
    "registro_nrc" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "id_municipio" INTEGER DEFAULT 0,
    "direccion" TEXT DEFAULT '',
    "dui" TEXT DEFAULT '',
    "foto_url_nrc" TEXT DEFAULT '',
    "foto_obj_nrc" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre_contac_1" TEXT DEFAULT '',
    "telefono_contac_1" TEXT DEFAULT '',
    "correo_contac_1" TEXT DEFAULT '',
    "nombre_contac_2" TEXT DEFAULT '',
    "telefono_contac_2" TEXT DEFAULT '',
    "correo_contac_2" TEXT DEFAULT '',
    "nombre_contac_3" TEXT DEFAULT '',
    "telefono_contac_3" TEXT DEFAULT '',
    "correo_contac_3" TEXT DEFAULT '',
    "id_usuario" INTEGER NOT NULL DEFAULT 0,
    "id_tipo_proveedor" INTEGER,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Compras" (
    "id_compras" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL DEFAULT '0',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proveedor" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT DEFAULT '',
    "no_registro" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "id_proveedor" INTEGER,
    "tipo_pago" INTEGER NOT NULL DEFAULT 1,
    "id_usuario" INTEGER NOT NULL DEFAULT 0,
    "dias_credito" INTEGER DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "iva_retenido" DOUBLE PRECISION DEFAULT 0,
    "iva_percivido" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "clase" INTEGER DEFAULT 1,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'ACTIVO',
    "id_bodega" INTEGER,

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("id_compras")
);

-- CreateTable
CREATE TABLE "ComprasDetalle" (
    "id_compras_detalle" SERIAL NOT NULL,
    "id_compras" INTEGER NOT NULL,
    "id_catalogo" INTEGER,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_sin_iva" DOUBLE PRECISION DEFAULT 0,
    "precio_con_iva" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento_porcentaje" DOUBLE PRECISION DEFAULT 0,
    "descuento_monto" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComprasDetalle_pkey" PRIMARY KEY ("id_compras_detalle")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id_inventario" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL,
    "id_compras_detalle" INTEGER,
    "id_bodega" INTEGER,
    "costo" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id_inventario")
);

-- CreateTable
CREATE TABLE "Kardex" (
    "id_kardex" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL,
    "id_compras_detalle" INTEGER,
    "tipo_movimiento" INTEGER NOT NULL DEFAULT 1,
    "descripcion" TEXT,
    "costo" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "costo_promedio" DOUBLE PRECISION DEFAULT 0,
    "inventario" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Kardex_pkey" PRIMARY KEY ("id_kardex")
);

-- CreateIndex
CREATE INDEX "fk_bodega_sucursal_id" ON "Bodegas"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_proveedor_tipo_id" ON "Proveedores"("id_tipo_proveedor");

-- CreateIndex
CREATE INDEX "fk_proveedor_municipio_id" ON "Proveedores"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_proveedor_usuario_id" ON "Proveedores"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_compras_bodega_id" ON "Compras"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_compra_usuario_id" ON "Compras"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_compras_proveedor_id" ON "Compras"("id_proveedor");

-- CreateIndex
CREATE INDEX "fk_compra_detalle_id" ON "ComprasDetalle"("id_compras");

-- CreateIndex
CREATE INDEX "fk_compras_detalle_catalogo_id" ON "ComprasDetalle"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_inventario_bodega_id" ON "Inventario"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_inventario_catalogo_id" ON "Inventario"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_inventario_detalle_id" ON "Inventario"("id_compras_detalle");

-- CreateIndex
CREATE INDEX "fk_kardex_catalogo_id" ON "Kardex"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_kardex_detalle_id" ON "Kardex"("id_compras_detalle");

-- AddForeignKey
ALTER TABLE "Bodegas" ADD CONSTRAINT "fk_bodega_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_tipo" FOREIGN KEY ("id_tipo_proveedor") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compra_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ComprasDetalle" ADD CONSTRAINT "fk_compra_detalle" FOREIGN KEY ("id_compras") REFERENCES "Compras"("id_compras") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ComprasDetalle" ADD CONSTRAINT "fk_compras_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_detalle" FOREIGN KEY ("id_compras_detalle") REFERENCES "ComprasDetalle"("id_compras_detalle") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "fk_kardex_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "fk_kardex_detalle" FOREIGN KEY ("id_compras_detalle") REFERENCES "ComprasDetalle"("id_compras_detalle") ON DELETE NO ACTION ON UPDATE NO ACTION;
