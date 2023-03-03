import expres from "express";
const response = expres.response;
const request = expres.request;  
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
 

export const crearFactura = async (req = request, resp = response) => {
  let { nombre="" } = req.body;
  try {   
    const data = await prisma.catalogoTipo.create({
      data: {
        nombre
      },
    }); 
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
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