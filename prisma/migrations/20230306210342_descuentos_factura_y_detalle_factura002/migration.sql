/*
  Warnings:

  - The values [ELIMINADO] on the enum `FacturaTiposDescuentos` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FacturaTiposDescuentos_new" AS ENUM ('ITEM', 'GLOBAL', 'AMBOS');
ALTER TABLE "FacturasDescuentos" ALTER COLUMN "isItem" DROP DEFAULT;
ALTER TABLE "FacturasDescuentos" ALTER COLUMN "isItem" TYPE "FacturaTiposDescuentos_new" USING ("isItem"::text::"FacturaTiposDescuentos_new");
ALTER TYPE "FacturaTiposDescuentos" RENAME TO "FacturaTiposDescuentos_old";
ALTER TYPE "FacturaTiposDescuentos_new" RENAME TO "FacturaTiposDescuentos";
DROP TYPE "FacturaTiposDescuentos_old";
ALTER TABLE "FacturasDescuentos" ALTER COLUMN "isItem" SET DEFAULT 'AMBOS';
COMMIT;
