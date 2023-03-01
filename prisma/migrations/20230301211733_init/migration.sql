-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "Roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "Estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Sucursales" (
    "id_sucursal" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Sucursales_pkey" PRIMARY KEY ("id_sucursal")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dui" TEXT,
    "foto" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_rol" INTEGER NOT NULL,
    "id_sucursal" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_foto_key" ON "Usuarios"("foto");

-- CreateIndex
CREATE INDEX "fk_usuario_rol_id" ON "Usuarios"("id_rol");

-- CreateIndex
CREATE INDEX "fk_usuario_sucursal_id" ON "Usuarios"("id_sucursal");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "Roles"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "fk_usuario_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
