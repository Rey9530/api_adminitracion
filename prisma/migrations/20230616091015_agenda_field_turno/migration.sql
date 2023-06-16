-- CreateEnum
CREATE TYPE "Turnos" AS ENUM ('DESAYUNO', 'ALMUERZO', 'CENA');

-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "turno" "Turnos";
