import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (__: any, resp = response) => {
  const registros = await prisma.facturasDescuentos.findMany({
    where: { estado: "ACTIVO" },
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};

export const getRegistrosActivos = async (__: any, resp = response) => {
  const data = await prisma.facturasDescuentos.findMany({
    where: {
      estado: "ACTIVO",
      OR: [{ isItem: "AMBOS" }, { isItem: "GLOBAL" }, { isItem: "ITEM" }],
    },
  });
  const total = await data.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
    total,
  });
};
export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.facturasDescuentos.findFirst({
    where: { id_descuento: uid, estado: "ACTIVO" },
  });

  if (!registros) {
    resp.status(400).json({
      status: false,
      msg: "El registro no existe",
    });
  } else {
    resp.json({
      status: true,
      msg: "Exito",
      registros,
    });
  }
};

export const crearRegistro = async (req = request, resp = response) => {
  let { nombre = "", porcentaje = 0, isItem = "AMBOS" } = req.body;
  try {
    const data = await prisma.facturasDescuentos.create({
      data: {
        nombre,
        porcentaje,
        isItem,
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

export const actualizarRegistro = async (req = request, resp = response) => {
  // validar que el actual no sea mayor que el +hasta+ o menor que el +desde+
  let uid: number = Number(req.params.id);
  try {
    const registro = await prisma.facturasDescuentos.findFirst({
      where: { id_descuento: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let { nombre = "", porcentaje = 0, isItem = "AMBOS" } = req.body;

    const registroActualizado = await prisma.facturasDescuentos.update({
      where: { id_descuento: uid },
      data: {
        nombre,
        porcentaje,
        isItem,
      },
    });
    resp.json({
      status: true,
      msg: "Registro Actualizado",
      data: registroActualizado,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};

export const eliminarRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    const registro = await prisma.facturasDescuentos.findFirst({
      where: { id_descuento: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.facturasDescuentos.update({
      data: { estado: "INACTIVO" },
      where: { id_descuento: uid },
    });
    resp.json({
      status: true,
      msg: "Registro elimiando",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};

export const getTiposDescuentos = async (_ = request, resp = response) => {
  try {
    resp.json({
      status: true,
      msg: "Success",
      data: ["ITEM", "GLOBAL", "AMBOS", "INACTIVO"],
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
