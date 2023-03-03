import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (__: any, resp = response) => {
  const registros = await prisma.facturasBloques.findMany({
    where: { estado: "ACTIVO" },
    include:{Tipo:true}
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};
export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.facturasBloques.findFirst({
    where: { id_bloque: uid, estado: "ACTIVO" },
    include:{Tipo:true}
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
  let {
    tira = "",
    desde = 0,
    hasta = 0,
    actual = 0,
    serie = "",
    id_tipo_factura = 0,
  } = req.body;
  try {
    const data = await prisma.facturasBloques.create({
      data: {
        tira,
        desde,
        hasta,
        actual,
        serie,
        id_tipo_factura,
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
  let uid: number = Number(req.params.id);
  try {
    const registro = await prisma.facturasBloques.findFirst({
      where: { id_bloque: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let {
      tira = "",
      desde = 0,
      hasta = 0,
      actual = 0,
      serie = "",
      id_tipo_factura = 0,
    } = req.body;
    const registroActualizado = await prisma.facturasBloques.update({
      where: { id_bloque: uid },
      data: {
        tira,
        desde,
        hasta,
        actual,
        serie,
        id_tipo_factura,
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
    const registro = await prisma.facturasBloques.findFirst({
      where: { id_bloque: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.facturasBloques.update({
      data: { estado: "INACTIVO" },
      where: { id_bloque: uid },
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
