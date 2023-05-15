import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (req = request, resp = response) => {
  let { id_sucursal = 0 } = req.query;
  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  const registros = await prisma.agenda.findMany({
    include: { Sucursales: true },
    where: { ...wSucursal },
  });
  const total = await registros.length;
  var ahora = await getRegistrosDelDia(id_sucursal);
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
    ahora,
  });
};

export const getRegistrosDelDia = async (id_sucursal = 0) => {
  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  var desde = new Date();
  var hasta = new Date();
  hasta.setHours(hasta.getHours() + 23);
  console.log(desde);
  console.log(hasta);
  const registros = await prisma.agenda.findMany({
    include: { Sucursales: true },
    where: {
      ...wSucursal,
      inicio: {
        gte: desde,
        lte: hasta,
      },
    },
  });
  return registros;
};

export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.agenda.findFirst({
    where: { id_agenda: uid },
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
  let { uid = 0 } = req.params;
  uid = Number(uid);
  let {
    nombre = "",
    id_sucursal = 0,
    zona = "",
    no_personas = "",
    telefono = "",
    date = "",
    start = "",
    nota = "",
  } = req.body;
  date = date.split("T")[0];
  start = start.split(":");
  var inicio = new Date(date);
  inicio.setHours(inicio.getHours() + Number(start[0]));
  inicio.setMinutes(inicio.getMinutes() + Number(start[1]));

  var fin = new Date(date);
  fin.setHours(fin.getHours() + Number(start[0]));
  fin.setMinutes(fin.getMinutes() + Number(start[1]));
  fin.setHours(fin.getHours() + 2);
  try {
    id_sucursal = Number(id_sucursal);
    const data = await prisma.agenda.create({
      data: {
        zona,
        id_sucursal,
        no_personas,
        nombre,
        telefono,
        inicio,
        fin,
        nota,
        id_usuario: uid,
      },
    });
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
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

export const actualizarRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    let {
      nombre = "",
      id_sucursal = 0,
      zona = "",
      no_personas = "",
      telefono = "",
      date = "",
      start = "",
      nota = "",
    } = req.body;
    id_sucursal = Number(id_sucursal);
    console.log(date);
    console.log(start);

    const [registro, sucursal] = await Promise.all([
      await prisma.agenda.findFirst({
        where: { id_agenda: uid },
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
    const registroActualizado = await prisma.agenda.update({
      where: { id_agenda: uid },
      data: {
        zona,
        id_sucursal,
        no_personas,
        nombre,
        telefono,
        inicio: new Date(),
        fin: new Date(),
        nota,
        id_usuario: uid,
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
    const registro = await prisma.agenda.findFirst({
      where: { id_agenda: uid },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.agenda.update({
      data: { estado: "CANCELADA" },
      where: { id_agenda: uid },
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
