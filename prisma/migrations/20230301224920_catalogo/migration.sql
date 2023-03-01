-- CreateTable
CREATE TABLE "CatalogoCategorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "CatalogoCategorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "CatalogoTipo" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "CatalogoTipo_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "Catalogo" (
    "id_catalogo" SERIAL NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Catalogo_pkey" PRIMARY KEY ("id_catalogo")
);

-- CreateIndex
CREATE INDEX "fk_tipo_catalogo_id" ON "Catalogo"("id_tipo");

-- CreateIndex
CREATE INDEX "fk_categoria_sefvicio_id" ON "Catalogo"("id_categoria");

-- AddForeignKey
ALTER TABLE "Catalogo" ADD CONSTRAINT "fk_tipo_catalogo" FOREIGN KEY ("id_tipo") REFERENCES "CatalogoTipo"("id_tipo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Catalogo" ADD CONSTRAINT "fk_categoria_sefvicio" FOREIGN KEY ("id_categoria") REFERENCES "CatalogoCategorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;
