/*
  Warnings:

  - The `no_personas` column on the `Agenda` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agenda" DROP COLUMN "no_personas",
ADD COLUMN     "no_personas" INTEGER DEFAULT 0;
