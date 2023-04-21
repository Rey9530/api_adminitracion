import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const libroCompras = async (req = request, resp = response) => {
  // let { ids = 0 } = req.params;
  // let id_sucursal = Number(ids);
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
