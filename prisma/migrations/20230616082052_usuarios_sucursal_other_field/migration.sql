/*
  Warnings:

  - Made the column `id_sucursal` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "id_sucursal_reser" INTEGER,
ALTER COLUMN "id_sucursal" SET NOT NULL;
