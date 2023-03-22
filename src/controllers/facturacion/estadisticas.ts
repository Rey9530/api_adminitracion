import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getVentasMensuales = async (req = request, resp = response) => {
  let { anio = 2023 }: any = req.query;

  var data: any[] = [];
  for (let index = 0; index <= 11; index++) {
    var diasTotales = new Date(anio, index + 1, 0).getDate() - 1;
    var desde = new Date(anio, index, 1, 0, 0, 0);
    var hasta = new Date(anio, index, diasTotales, 23, 59, 59);

    var result = await prisma.facturas.aggregate({
      _sum: {
        total: true,
      },
      where: {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
      },
    });
    data.push(result._sum.total ?? 0);
  }

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};

export const getVentasXTipoDocumento = async (
  req = request,
  resp = response
) => {
  var desde1: any = req.query.desde!.toString().split("-");
  var hasta1: any = req.query.hasta!.toString().split("-");
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
  var data: any[] = [];

  var tiposFacturas = await prisma.facturasTipos.findMany({
    where: { estado: "ACTIVO" },
  });

  // tiposFacturas.forEach(async (element) => {
    
  // });

  for (let index = 0; index < tiposFacturas.length; index++) {
    const element = tiposFacturas[index];
    var res:any = await prisma.facturas.aggregate({
      _sum: { total: true },
      where: {
        Bloque: { id_tipo_factura: element.id_tipo_factura },
        estado: "ACTIVO",
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
      },
    });
    data.push({
      label: element.nombre,
      total: res._sum.total ?? 0,
    });
  }

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};
