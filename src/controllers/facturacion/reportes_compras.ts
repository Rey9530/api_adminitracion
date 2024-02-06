import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const libroCompras = async (req = request, resp = response) => {
  var desde1: any = req.query.desde!.toString().split("-");
  var hasta1: any = req.query.hasta!.toString().split("-");
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
  var data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
    },
    include: { Proveedor: true },
  });

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};

export const libroComprasAlContado = async (req = request, resp = response) => {
  var desde1: any = req.query.fecha!.toString().split("-");
  var hasta1: any = req.query.fecha!.toString().split("-");
  var id_sucursal: any = req.query.id_sucursal;
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);

  id_sucursal = Number(id_sucursal);
  var wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  var data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      ...wSucursal,
      tipo_pago: "CONTADO",
    },
    include: { Proveedor: true },
  });

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};

export const obtenerListadoCompras = async (req = request, resp = response) => {
  var desde1: any = req.query.desde!.toString();
  var hasta1: any = req.query.hasta!.toString();
  var sucursal: number = Number(req.query.sucursal);
  let desde = new Date(desde1);
  let hasta = new Date(hasta1);
  hasta.setHours(hasta.getHours() + 23);
  hasta.setMinutes(hasta.getMinutes() + 59);
  hasta.setSeconds(hasta.getSeconds() + 59);

  let wSucursal = {};
  if (sucursal > 0) {
    wSucursal = { id_sucursal: sucursal };
  } 
  const [data, result] = await Promise.all([
    await prisma.compras.findMany({
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
        ...wSucursal,
      },
      include: { Proveedor: true, Sucursales: true, FacturasTipos: true },
      orderBy: [
        {
          id_compras: "asc",
        },
      ],
    }),
    await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
        ...wSucursal,
      },
    }),
  ]);

  return resp.json({
    status: true,
    msg: "Success",
    data: { listado: data, total: result._sum.total ?? 0, },
  });
};

export const obtenerListadoComprasInventario = async (
  req = request,
  resp = response
) => {
  var desde: any = req.query.desde!.toString();
  var hasta: any = req.query.hasta!.toString();
  desde = new Date(desde);
  hasta = new Date(hasta);
  hasta.setDate(hasta.getDate() + 1);

  const data = await prisma.compras.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      id_bodega: {
        gte: 1,
      },
    },
    include: {
      Proveedor: true,
      Sucursales: true,
      FacturasTipos: true,
      Bodegas: true,
      ComprasDetalle: { include: { Catalogo: { select: { nombre: true } } } },
    },
    orderBy: [
      {
        id_compras: "asc",
      },
    ],
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};
