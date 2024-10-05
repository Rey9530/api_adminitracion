import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
import { formatDate, formatOnlyDate } from "../../helpers/format_dates";
import * as XLSX from 'xlsx';
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
  let id_proveedor: number = Number(req.query.id_proveedor);
  let wProveedor = {};//id_proveedor
  if (id_proveedor > 0) {
    wProveedor = { id_proveedor };
  }
  const [data, result] = await Promise.all([
    await prisma.compras.findMany({
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
        ...wSucursal,
        ...wProveedor,
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
        ...wProveedor,
      },
    }),
  ]);

  return resp.json({
    status: true,
    msg: "Success",
    data: { listado: data, total: result._sum.total ?? 0, },
  });
};
export const obtenerListadoComprasExcel = async (req = request, res = response) => {
  try {
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
  let id_proveedor: number = Number(req.query.id_proveedor);
  let wProveedor = {};//id_proveedor
  if (id_proveedor > 0) {
    wProveedor = { id_proveedor };
  }
  const [compras, total] = await Promise.all([
    await prisma.compras.findMany({
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
        ...wSucursal,
        ...wProveedor,
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
        ...wProveedor,
      },
    }),
  ]);

    // Preparar los datos para el archivo Excel
    const data: any = compras.map((compra) => ({
      'Fecha doc': formatOnlyDate(compra.fecha_factura ?? new Date()),
      '# Doc': compra.numero_factura,
      'Tipo': compra.FacturasTipos?.nombre ?? "",
      'Sucursal': compra.Sucursales ? compra.Sucursales.nombre : '',
      'Proveedor': compra.Proveedor ? compra.Proveedor.nombre : '',
      'Concepto': compra.detalle,
      'Sumas': compra.subtotal,
      'IVA': compra.iva,
      'Sub Total': (Number(compra.iva) + Number(compra.subtotal)),
      'IVA Percibido': compra.iva_percivido,
      'Descuento': compra.descuento,
      'Valor Total': compra.total
    }));

    // Agregar una fila para el total
    data.push({ 
      'Fecha doc': '',
      '# Doc': '',
      'Tipo': '',
      'Sucursal': '',
      'Proveedor': '',
      'Concepto': '',
      'Sumas': '',
      'IVA': '',
      'Sub Total': '',
      'IVA Percibido': '',
      'Descuento': '',
      'Valor Total': total._sum.total ?? 0
    }); 
    // Crear un nuevo libro de Excel y agregar una hoja con los datos
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de Compras');

    // Convertir el libro a un buffer de Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const fileName = `ListadoCompras_${formatDate(new Date(), true)}.xlsx`;

    // Configurar las cabeceras y enviar el archivo como respuesta
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    res.status(500).json({ status: false, msg: 'Error al generar el archivo Excel' });
  }
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
