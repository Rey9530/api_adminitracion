/*
  Warnings:

  - Added the required column `azone_id` to the `Departamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo_iso` to the `Departamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Departamentos" ADD COLUMN     "azone_id" TEXT NOT NULL,
ADD COLUMN     "codigo_iso" TEXT NOT NULL;
