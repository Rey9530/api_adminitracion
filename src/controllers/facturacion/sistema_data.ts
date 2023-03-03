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

export const updateDatosSistema = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    let { nombre_sistema = 0, impuesto = 0 } = req.body;
     await prisma.generalData.update({
      where: { id_general: uid },
      data: {
        nombre_sistema,
        impuesto,
      },
    });
    resp.json({
      status: true,
      msg: "Registro actualizado con exito",
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
