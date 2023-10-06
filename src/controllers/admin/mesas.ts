import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (__: any, resp = response) => {
  const registros = await prisma.mesas.findMany({
    where: { estado: "ACTIVO" },
    include: { Sucursales: true },
    orderBy: {
      id_mesa: "asc",
    },
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};
export const getRegistrosBySucursal = async (req = request, resp = response) => {
  var arrayUbi = ['PrimerPiso', 'SegundoPiso', 'Terraza'];
  let id_sucursal: number = Number(req.params.id_sucursal);
  let ubicacion: any = req.params.ubicacion.toString();
  if (!arrayUbi.includes(ubicacion)) {

    return resp.json({
      status: false,
      msg: "Parametro ubicacion es incorrecto",
      data: null
    });
  }
  const registros = await prisma.mesas.findMany({
    where: { estado: "ACTIVO", id_sucursal, ubicacion },
    orderBy: {
      id_mesa: "asc",
    },
    include: {
      CuentasClientes: true
    }
  });
  const total = await registros.length;
  return resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};

export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.mesas.findFirst({
    where: { id_mesa: uid, estado: "ACTIVO" },
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
  let { nombre = "", ubicacion = "", n_personas = "", id_sucursal = 0 } = req.body;
  try {
    id_sucursal = Number(id_sucursal);
    var sucursal = await prisma.sucursales.findFirst({
      where: { id_sucursal },
    });
    if (!sucursal) {
      return resp.status(400).json({
        status: false,
        msg: "La sucursal esta incorrecta",
      });
    }

    const data = await prisma.mesas.create({
      data: {
        nombre,
        id_sucursal,
        n_personas,
        ubicacion
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
    let { nombre = "", ubicacion = "", n_personas = "", id_sucursal = 0 } = req.body;
    id_sucursal = Number(id_sucursal);

    const [registro, sucursal] = await Promise.all([
      await prisma.mesas.findFirst({
        where: { id_mesa: uid, estado: "ACTIVO" },
      }),
      await prisma.sucursales.findFirst({
        where: { id_sucursal },
      }),
    ]);
    if (!registro || !sucursal) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe o la sucursal esta incorrecta",
      });
    }
    const registroActualizado = await prisma.mesas.update({
      where: { id_mesa: uid },
      data: { nombre, id_sucursal, ubicacion, n_personas, },
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
    const registro = await prisma.mesas.findFirst({
      where: { id_mesa: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.mesas.update({
      data: { estado: "INACTIVO" },
      where: { id_mesa: uid },
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
