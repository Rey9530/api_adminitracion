import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (req: any, resp = response) => {
  var id_usuario: any = Number(req.params.uid);
  var wSucursal = {};
  if (id_usuario > 0) {
    var usuario = await prisma.usuarios.findFirst({ where: { id: id_usuario } });
    if (Number(usuario?.id_sucursal_reser) > 0 && usuario?.id_rol!=1) {
      wSucursal = { id_sucursal: Number(usuario?.id_sucursal_reser) };
    }
  }


  const registros = await prisma.sucursales.findMany({
    where: { estado: "ACTIVO", ...wSucursal },
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
  const registros = await prisma.sucursales.findFirst({
    where: { id_sucursal: uid, estado: "ACTIVO" },
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
  let { nombre = "", color = "" } = req.body;
  try {
    const data = await prisma.sucursales.create({
      data: {
        nombre,
        color,
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
    const registro = await prisma.sucursales.findFirst({
      where: { id_sucursal: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let { nombre = "", color = "" } = req.body;
    const registroActualizado = await prisma.sucursales.update({
      where: { id_sucursal: uid },
      data: { nombre, color },
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
    const registro = await prisma.sucursales.findFirst({
      where: { id_sucursal: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.sucursales.update({
      data: { estado: "INACTIVO" },
      where: { id_sucursal: uid },
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
