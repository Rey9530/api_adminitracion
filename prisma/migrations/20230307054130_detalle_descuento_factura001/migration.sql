-- AlterTable
ALTER TABLE "Facturas" ALTER COLUMN "id_municipio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FacturasDetalle" ALTER COLUMN "id_descuento" DROP NOT NULL;
