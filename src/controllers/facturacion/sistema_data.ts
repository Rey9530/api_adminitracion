import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDatosSistema = async (_ = request, resp = response) => { 
  try {
    const data = await prisma.generalData.findFirst();
    resp.json({
      status: true,
      msg: "Registros",
      data,
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
