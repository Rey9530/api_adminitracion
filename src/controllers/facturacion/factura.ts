import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTiposFacturaEliminar = async (_ = request, resp = response) => {  //todo: eliminar
  try {
    const data = await prisma.facturasTipos.findMany({
      where: { estado: "ACTIVO" },
      include:{ Bloques: { where :{ estado:'ACTIVO' }} }
    });
    resp.json({
      status: true,
      msg: "Listado de registros",
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
