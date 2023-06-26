-- AlterTable
ALTER TABLE "GeneralData" ADD COLUMN     "correos" TEXT,
ADD COLUMN     "notificar_correo" BOOLEAN DEFAULT false;
