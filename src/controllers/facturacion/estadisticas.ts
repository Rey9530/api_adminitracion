import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getVentasMensuales = async (req = request, resp = response) => {
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  let { anio = new Date().getFullYear() }: any = req.query;

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
        id_sucursal,
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
export const porMesSucursal = async (req = request, resp = response) => {
  // let { ids = 0 } = req.params;
  // let id_sucursal = Number(ids);
  let { anio = new Date().getFullYear() }: any = req.query;

  var sucursales = await prisma.sucursales.findMany({
    where: { estado: "ACTIVO" },
  });

  var data: any[] = [];
  for (let index = 0; index < sucursales.length; index++) {
    const sucursal = sucursales[index];
    var totales = [];
    for (let index = 0; index <= 11; index++) {
      var diasTotales = new Date(anio, index + 1, 0).getDate() - 1;
      var desde = new Date(anio, index, 1, 0, 0, 0);
      var hasta = new Date(anio, index, diasTotales, 23, 59, 59);

      var result = await prisma.compras.aggregate({
        _sum: {
          total: true,
        },
        where: {
          fecha_factura: {
            gte: desde,
            lte: hasta,
          },
          id_sucursal: sucursal.id_sucursal,
        },
      });
      totales.push(result._sum.total ?? 0);
    }
    data.push({ name: sucursal.nombre, data: totales });
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
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  var desde1: any = req.query.desde!.toString().split("-");
  var hasta1: any = req.query.hasta!.toString().split("-");
  var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
  var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
  var data_pie: any[] = [];

  var tiposFacturas = await prisma.facturasTipos.findMany({
    where: { estado: "ACTIVO" },
  });
  for (let index = 0; index < tiposFacturas.length; index++) {
    const element = tiposFacturas[index];
    var res: any = await prisma.facturas.aggregate({
      _sum: { total: true },
      where: {
        Bloque: { id_tipo_factura: element.id_tipo_factura },
        estado: "ACTIVO",
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
        id_sucursal,
      },
    });
    data_pie.push({
      label: element.nombre,
      total: res._sum.total ?? 0,
    });
  }

  var data_fechas: any[] = [];
  var diff = hasta.getTime() - desde.getTime();
  var dias = diff / (1000 * 60 * 60 * 24);
  for (let index = 0; index < dias; index++) {
    var dia_desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var dia_hasta = new Date(desde1[0], desde1[1] - 1, desde1[2], 23, 59, 59);
    dia_desde.setDate(dia_desde.getDate() + index);
    dia_hasta.setDate(dia_hasta.getDate() + index);
    var dum_day = await prisma.facturas.aggregate({
      _sum: { total: true },
      where: {
        estado: "ACTIVO",
        fecha_creacion: {
          gte: dia_desde,
          lte: dia_hasta,
        },
        id_sucursal,
      },
    });
    data_fechas.push({
      monto: dum_day._sum.total ?? 0,
      fecha: convert(dia_desde.toString()),
    });
  }

  resp.json({
    status: true,
    msg: "Listado de registros",
    data_pie,
    data_fechas,
  });
};

export const porProveedores = async (req = request, resp = response) => {
  let id_sucursal: number = Number(req.params.id_sucursal);
  var wSucursal = {};
  if (id_sucursal) {
    wSucursal = { id_sucursal };
  }
  var proveedoresIds = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    take: 10,
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    where: {
      ...wSucursal,
    },
  });

  var data = [];
  for (let index = 0; index < proveedoresIds.length; index++) {
    const element = proveedoresIds[index];
    var proveedor = await prisma.proveedores.findUnique({
      where: {
        id_proveedor: element.id_proveedor ?? 0,
      },
    });
    data.push({
      nombre: proveedor?.nombre,
      monto: element._sum.total ?? 0,
      id_proveedor: element.id_proveedor,
    });
  }

  resp.json({
    status: true,
    msg: "Listado de registros",
    data,
  });
};
const convert = (str: string) => {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
};
