/*
  Warnings:

  - You are about to drop the column `obj_imagen` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `url_foto_nrc` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "obj_imagen",
DROP COLUMN "url_foto_nrc",
ADD COLUMN     "foto_obj_nrc" TEXT,
ADD COLUMN     "foto_url_nrc" TEXT DEFAULT '';
