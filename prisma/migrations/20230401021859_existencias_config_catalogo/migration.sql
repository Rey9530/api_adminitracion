/*
  Warnings:

  - You are about to drop the column `rango_maximo` on the `Catalogo` table. All the data in the column will be lost.
  - You are about to drop the column `rango_minimo` on the `Catalogo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Catalogo" DROP COLUMN "rango_maximo",
DROP COLUMN "rango_minimo",
ADD COLUMN     "existencias_maximas" INTEGER DEFAULT 0,
ADD COLUMN     "existencias_minimas" INTEGER DEFAULT 0;
