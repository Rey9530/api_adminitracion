/*
  Warnings:

  - You are about to alter the column `precio_con_iva` on the `Catalogo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `precio_sin_iva` on the `Catalogo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `precio_sin_iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `precio_con_iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Catalogo" ALTER COLUMN "precio_con_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "precio_sin_iva" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Facturas" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DEFAULT 0,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DEFAULT 0,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "FacturasDetalle" ALTER COLUMN "precio_sin_iva" SET DEFAULT 0,
ALTER COLUMN "precio_sin_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "precio_con_iva" SET DEFAULT 0,
ALTER COLUMN "precio_con_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DEFAULT 0,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DEFAULT 0,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;
