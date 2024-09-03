import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
import { htmlReporteCheques, htmlImprimirCheque, htmlReporteChequesConsoli } from "../../helpers/html_to_pdf/cheques_reporte";
import { generarPdf } from "../../helpers/generar_pdfs";
const prisma = new PrismaClient();
import axios from 'axios';

export const buscarEnCatalogo = async (req = request, resp = response) => {
  let { query = "", id_bodega = 0 } = req.body;
  id_bodega = Number(id_bodega);
  if (query.length == 0) {
    return resp.json({
      status: false,
      msg: "El parametro no es valido",
      data: null,
    });
  }
  let arrayQuery = query.split(" ");
  const data = await prisma.catalogo.findMany({
    where: {
      OR: arrayQuery.map((contains: any) => {
        return {
          nombre: {
            contains,
            mode: "insensitive",
          },
        };
      }),
      AND: [
        {
          id_tipo: 2,
        },
      ],
    },
    include: {
      Inventario: { where: { existencia: { gte: 1 }, id_bodega }, take: 1 },
      Kardex: {
        where: { inventario: { gte: 1 } },
        orderBy: { id_kardex: "desc" },
        take: 1,
      },
    },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const comprasACheque = async (req = request, resp = response) => {
  let { idsCompras = [] } = req.body;

  if (!(idsCompras.length > 0)) {
    return resp.json({
      status: false,
      msg: "El listado de compras no es valido",
      data: null,
    });
  }

  const data = await prisma.compras.updateMany({
    where: {
      OR: idsCompras.map((contains: number) => {
        return {
          id_compras: contains,
        };
      }),
    },
    data: {
      estado_pago: "ENCHEQUE",
    },
  });
  return resp.json({
    status: data.count > 0,
    msg: data.count > 0 ? "Compras procesadas" : "Ha ocurrido un error",
  });
};

export const pagarCheque = async (req = request, resp = response) => {
  let { idsProveedores = [], id_sucursal = 0 } = req.body;
  const { uid = 0, } = req.params;
  const id_usuario = Number(uid);

  if (!(idsProveedores.length > 0)) {
    return resp.json({
      status: false,
      msg: "El listado de compras no es valido",
      data: null,
    });
  }
  id_sucursal = Number(id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  let data = 0;
  for (let index = 0; index < idsProveedores.length; index++) {
    const element = idsProveedores[index];
    const cheque = await prisma.cheques.create({
      data: {
        no_cheque: element.no_cheque,
        id_usuario
      }
    });
    var fecha = new Date();
    var datos = await prisma.compras.updateMany({
      where: {
        id_proveedor: Number(element.id_proveedor),
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
      data: {
        estado_pago: "PAGADO",
        fecha_actualizacion: fecha,
        no_cheque: element.no_cheque,
        id_cheque: cheque.id_cheque,
      },
    });
    if (datos.count > 0) {
      data++;
    }
  }
  return resp.json({
    status: data > 0,
    msg: data > 0 ? "Compras procesadas" : "Ha ocurrido un error",
  });
};

export const buscarProveedor = async (req = request, resp = response) => {
  let { query = "" } = req.body;
  if (query.length == 0) {
    return resp.json({
      status: false,
      msg: "El parametro no es valido",
      data: null,
    });
  }
  let consultas = [];
  if (query.length > 3) {
    let array = query.split(" ");
    let mode = "insensitive";
    consultas = array.map((contains: any) => {
      return {
        AND: [
          {
            OR: [
              { nombre: { contains, mode } },
              { giro: { contains, mode } },
              { razon_social: { contains, mode } },
              { registro_nrc: { contains, mode } },
              { nit: { contains, mode } },
              { direccion: { contains, mode } },
              { dui: { contains, mode } },
            ],
          },
        ],
      };
    });
  }
  const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
  const data = await prisma.proveedores.findMany({
    where,
    orderBy: {
      nombre: "desc",
    },
    take: 20,
    include: { Municipio: true },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const obtenerBodegas = async (req = request, resp = response) => {
  let id_sucursal: number = Number(req.params.id);
  const data = await prisma.bodegas.findMany({
    where: { estado: "ACTIVO", id_sucursal },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const obtenercxpPorProveedor = async (req = request, resp = response) => {

  let id_sucursal: number = Number(req.params.id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  var estado_pago: any = "PENDIENTE";
  var proveedores = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    where: {
      ...wSucursal,
      tipo_pago: "CREDITO",
      estado_pago,
    },
  });

  var data = [];
  for (let index = 0; index < proveedores.length; index++) {
    const element = proveedores[index];
    var provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: element.id_proveedor ?? 0 },
      include: { TipoProveedor: true, },
    });

    var compras = await prisma.compras.findMany({
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago,
        ...wSucursal,
      },
      include: {
        FacturasTipos: true,
        Sucursales: true,
      }
    });
    var registro = await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago,
        ...wSucursal,
      },
    });
    data.push({
      proveedor: provv ?? "",
      monto: registro._sum.total ?? 0,
      compras
    });
  }

  return resp.json({
    status: true,
    msg: "Success",
    data,
  });

};

export const obntenerListadoFacturas = async (
  req = request,
  resp = response
) => {
  var desde: any = req.query.desde!.toString();
  var hasta: any = req.query.hasta!.toString();
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);

  // fecha.setDate(fecha.getDate() + dias);
  desde = new Date(desde);
  hasta = new Date(hasta);
  hasta.setDate(hasta.getDate() + 1);

  var total_facturado = 0;
  var total_facturas = 0;
  var total_consumidor_final = 0;
  var total_facturas_consumidor_final = 0;
  var total_credito_fiscal = 0;
  var total_facturas_credito_fiscal = 0;
  var total_anuladas = 0;
  var total_facturas_anuladas = 0;

  const data = await prisma.facturas.findMany({
    where: {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
      id_sucursal,
    },
    include: { Bloque: { include: { Tipo: true } } },
    orderBy: [
      {
        id_factura: "asc",
      },
    ],
  });
  data.forEach((e: any) => {
    total_facturas++;
    total_facturado += e.total ?? 0;
    if (e.estado == "ANULADA") {
      total_anuladas += e.total ?? 0;
      total_facturas_anuladas++;
    } else if (e.Bloque.Tipo.id_tipo_factura == 1) {
      total_consumidor_final += e.total ?? 0;
      total_facturas_consumidor_final++;
    } else {
      total_credito_fiscal += e.total ?? 0;
      total_facturas_credito_fiscal++;
    }
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
    contadores: {
      total_facturado,
      total_facturas,
      total_consumidor_final,
      total_facturas_consumidor_final,
      total_credito_fiscal,
      total_facturas_credito_fiscal,
      total_anuladas,
      total_facturas_anuladas,
    },
  });
};

export const obntenerListadoFacturasAlCredito = async (
  req = request,
  resp = response
) => {
  let id_sucursal: number = Number(req.params.id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  let id_proveedor: number = Number(req.params.id_proveedor);
  let wProveedor = {};
  if (id_proveedor > 0) {
    wProveedor = { id_proveedor };
  }
  const data = await prisma.compras.findMany({
    where: {
      ...wSucursal,
      ...wProveedor,
      estado_pago: "PENDIENTE",
      tipo_pago: "CREDITO",
    },
    include: { Proveedor: true },
    orderBy: [
      {
        fecha_de_pago: "asc",
      },
    ],
  });

  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};


export const revertirEstadoCompra = async (
  req = request,
  resp = response
) => {

  let id_compra: number = Number(req.params.id_compra);

  await prisma.compras.update({
    where: { id_compras: id_compra },
    data: {
      estado_pago: "PENDIENTE"
    }
  });

  return resp.json({
    status: true,
    msg: "Datos Actualizados",
  });
};



export const eliminarCompra = async (
  req = request,
  resp = response
) => {
  let id_compras: any = Number(req.params.id_compra);
  id_compras = id_compras > 0 ? id_compras : null;
  await prisma.compras.delete({
    where: { id_compras },
  });
  return resp.json({
    status: true,
    msg: "Datos eliminado",
  });
};


export const obntenerListadoPrecheques = async (
  req = request,
  resp = response
) => {
  let id_sucursal: number = Number(req.params.id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }
  const [deudaPendiente, deudaEnCheque] = await Promise.all([
    await prisma.compras.aggregate({
      where: {
        ...wSucursal,
        tipo_pago: "CREDITO",
        estado_pago: "PENDIENTE",
      },
      _sum: {
        total: true,
      },
    }),
    await prisma.compras.aggregate({
      where: {
        ...wSucursal,
        tipo_pago: "CREDITO",
        estado_pago: "ENCHEQUE",
      },
      _sum: {
        total: true,
      },
    }),
  ]);

  var proveedores = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    where: {
      ...wSucursal,
      tipo_pago: "CREDITO",
      estado_pago: "ENCHEQUE",
    },
  });

  var data = [];
  for (let index = 0; index < proveedores.length; index++) {
    const element = proveedores[index];
    var provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: element.id_proveedor ?? 0 },
      select: { nombre: true, id_proveedor: true, Banco: true, no_cuenta: true, tipo_cuenta: true },
    });

    var compras = await prisma.compras.findMany({
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
      include: {
        FacturasTipos: true,
        Sucursales: true,
      }
    });
    var registro = await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
    });
    data.push({
      proveedor: provv?.nombre ?? "",
      id_proveedor: provv?.id_proveedor ?? 0,
      banco: provv?.Banco?.nombre ?? 0,
      no_cuenta: provv?.no_cuenta ?? 0,
      tipo_cuenta: provv?.tipo_cuenta ?? 0,
      monto: registro._sum.total ?? 0,
      compras
    });
  }

  var pending = deudaPendiente._sum.total ?? 0;
  var cheques = deudaEnCheque._sum.total ?? 0;
  var total = pending + cheques;

  return resp.json({
    status: true,
    msg: "Success",
    data,
    contadores: {
      pending,
      cheques,
      total,
    },
  });
};



export const obtenerListadocheques = async (
  req = request,
  resp = response
) => {

  var query: any = req.query.query ? req.query.query!.toString() : "";
  var desde_v: any = req.query.desde ? req.query.desde!.toString() : new Date().toString();
  var hasta_v: any = req.query.hasta ? req.query.hasta!.toString() : new Date().toString();
  var desde = new Date(desde_v);
  var hasta = new Date(hasta_v);
  hasta.setHours(hasta.getHours() + 23);
  hasta.setMinutes(hasta.getMinutes() + 59);
  desde = new Date(desde.toUTCString());
  hasta = new Date(hasta.toUTCString());

  var proveedores = await prisma.compras.groupBy({
    by: ["id_cheque", "no_cheque", "id_proveedor"],
    where: {
      tipo_pago: "CREDITO",
      estado_pago: "PAGADO",
      fecha_actualizacion: {
        gte: desde,
        lte: hasta,
      },
      OR: [
        {
          Proveedor: {
            nombre: {
              mode: "insensitive",
              contains: query,
            },
          },
        },
        {
          no_cheque: {
            mode: "insensitive",
            contains: query,
          },
        },
        {
          numero_factura: {
            mode: "insensitive",
            contains: query,
          }
        },
        {
          numero_quedan: {
            mode: "insensitive",
            contains: query,
          }
        }
      ]
    },
  });
  var data = [];
  for (let index = 0; index < proveedores.length; index++) {
    const element = proveedores[index];
    var provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: element.id_proveedor ?? 0 },
      select: { nombre: true, id_proveedor: true, Banco: true, no_cuenta: true, tipo_cuenta: true },
    });

    var where: any = {
      id_proveedor: element.id_proveedor,
      tipo_pago: "CREDITO",
      estado_pago: "PAGADO",
      id_cheque: element?.id_cheque ?? 0,
    };

    var compras = await prisma.compras.findMany({
      where,
      include: {
        FacturasTipos: true,
        Sucursales: true,
      }
    });
    var registro = await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where
    });
    var fecha = new Date(compras[0].fecha_actualizacion);
    fecha.setHours(fecha.getHours() + 6)
    data.push({
      proveedor: provv?.nombre ?? "",
      id_proveedor: provv?.id_proveedor ?? 0,
      no_cheque: element?.no_cheque ?? "0",
      id_cheque: element?.id_cheque ?? "0",
      monto: registro._sum.total ?? 0,
      fecha: compras.length > 0 ? fecha : new Date(),
      compras
    });
  }


  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const comprasPorProveedor = async (
  req = request,
  resp = response
) => {

  var query: any = req.query.query ? req.query.query!.toString() : "";
  var desde_v: any = req.query.desde ? req.query.desde!.toString() : new Date().toString();
  var hasta_v: any = req.query.hasta ? req.query.hasta!.toString() : new Date().toString();
  var desde = new Date(desde_v);
  var hasta = new Date(hasta_v);
  hasta.setHours(hasta.getHours() + 23);
  hasta.setMinutes(hasta.getMinutes() + 59);
  desde = new Date(desde.toUTCString());
  hasta = new Date(hasta.toUTCString());

  var proveedores = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    where: {
      // tipo_pago: "CREDITO",
      // estado_pago: "PAGADO",
      estado: "ACTIVO",
      fecha_factura: {
        gte: desde,
        lte: hasta,
      },
      OR: [
        {
          Proveedor: {
            nombre: {
              mode: "insensitive",
              contains: query,
            },
          },
        },
      ]
    },
    // orderBy: {
    //   Proveedor: {
    //     nombre: "asc"
    //   }
    // }
  });
  let data = [];
  for (let proveedor of proveedores) {
    let provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: proveedor.id_proveedor ?? 0 },
      select: { nombre: true, },
    });

    const [contado, credito, tarjetacredito] = await Promise.all([
      await prisma.compras.aggregate({
        where: {
          id_proveedor: proveedor.id_proveedor,
          estado: "ACTIVO",
          tipo_pago: "CONTADO",
          fecha_factura: {
            gte: desde,
            lte: hasta,
          },
        },
        _sum: {
          total: true,
        },
      }),
      await prisma.compras.aggregate({
        where: {
          id_proveedor: proveedor.id_proveedor,
          estado: "ACTIVO",
          tipo_pago: "CREDITO",
          fecha_factura: {
            gte: desde,
            lte: hasta,
          },
        },
        _sum: {
          total: true,
        },
      }),
      await prisma.compras.aggregate({
        where: {
          id_proveedor: proveedor.id_proveedor,
          estado: "ACTIVO",
          tipo_pago: "TARJETCREDITO",
          fecha_factura: {
            gte: desde,
            lte: hasta,
          },
        },
        _sum: {
          total: true,
        },
      }),
    ]);
    data.push({
      proveedor: provv?.nombre ?? "",
      contado: contado._sum.total ?? 0,
      credito: credito._sum.total ?? 0,
      tarjetacredito: tarjetacredito._sum.total ?? 0,
    });
  }


  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};



export const obtenerListadoCreditoUsuario = async (
  req = request,
  resp = response
) => {

  var id_usuario: number = Number(req.query.query ? req.query.id_usuario!.toString() : "0");
  var desde_v: any = req.query.desde ? req.query.desde!.toString() : new Date().toString();
  var hasta_v: any = req.query.hasta ? req.query.hasta!.toString() : new Date().toString();
  var desde = new Date(desde_v);
  var hasta = new Date(hasta_v);
  hasta.setHours(hasta.getHours() + 23);
  hasta.setMinutes(hasta.getMinutes() + 59);

  var wUsuario = {}
  if (id_usuario > 0) {
    wUsuario = { id_usuario }
  }
  const [compas, suncompas] = await Promise.all([
    await prisma.compras.findMany({
      where: {
        tipo_pago: "TARJETCREDITO",
        fecha_actualizacion: {
          gte: desde,
          lte: hasta,
        },
        ...wUsuario,
      },
      include: {
        Sucursales: true,
        Proveedor: true,
        FacturasTipos: true,
      }
    }),
    await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        tipo_pago: "TARJETCREDITO",
        fecha_actualizacion: {
          gte: desde,
          lte: hasta,
        },
        ...wUsuario,
      },
    }),
  ]);

  return resp.json({
    status: true,
    msg: "Success",
    data: compas,
    suma: suncompas._sum.total
  });
};

export const imprimirListadoPrecheques = async (
  req = request,
  resp = response
) => {
  let id_sucursal: number = Number(req.params.id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }

  var proveedores = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    where: {
      ...wSucursal,
      tipo_pago: "CREDITO",
      estado_pago: "ENCHEQUE",
    },
  });

  var data = [];
  for (let index = 0; index < proveedores.length; index++) {
    const element = proveedores[index];
    var provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: element.id_proveedor ?? 0 },
      select: { nombre: true, id_proveedor: true, Banco: true, no_cuenta: true, tipo_cuenta: true },
    });

    var compras = await prisma.compras.findMany({
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
      include: {
        FacturasTipos: true,
        Sucursales: true,
      }
    });
    var registro = await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
    });
    data.push({
      proveedor: provv?.nombre ?? "",
      id_proveedor: provv?.id_proveedor ?? 0,
      banco: provv?.Banco?.nombre ?? 0,
      no_cuenta: provv?.no_cuenta ?? 0,
      tipo_cuenta: provv?.tipo_cuenta ?? 0,
      monto: registro._sum.total ?? 0,
      compras
    });
  }

  var contenidoHtml: any = await htmlReporteCheques(data);
  const pdf = await generarPdf(contenidoHtml, "reporte_demo4", true, true);
  resp.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length });
  return resp.send(pdf);
};


export const imprimirListadoConsol = async (
  req = request,
  resp = response
) => {
  let id_sucursal: number = Number(req.params.id_sucursal);
  let wSucursal = {};
  if (id_sucursal > 0) {
    wSucursal = { id_sucursal };
  }

  var proveedores = await prisma.compras.groupBy({
    by: ["id_proveedor"],
    where: {
      ...wSucursal,
      tipo_pago: "CREDITO",
      estado_pago: "ENCHEQUE",
    },
  });

  var data = [];
  for (let index = 0; index < proveedores.length; index++) {
    const element = proveedores[index];
    var provv = await prisma.proveedores.findFirst({
      where: { id_proveedor: element.id_proveedor ?? 0 },
      select: { nombre: true, id_proveedor: true, Banco: true, no_cuenta: true, tipo_cuenta: true },
    });

    var registro = await prisma.compras.aggregate({
      _sum: {
        total: true,
      },
      where: {
        id_proveedor: element.id_proveedor,
        estado_pago: "ENCHEQUE",
        ...wSucursal,
      },
    });
    data.push({
      proveedor: provv?.nombre ?? "",
      id_proveedor: provv?.id_proveedor ?? 0,
      banco: provv?.Banco?.nombre ?? 0,
      no_cuenta: provv?.no_cuenta ?? 0,
      tipo_cuenta: provv?.tipo_cuenta ?? 0,
      monto: registro._sum.total ?? 0,

    });
  }

  var contenidoHtml: any = await htmlReporteChequesConsoli(data);
  const pdf = await generarPdf(contenidoHtml, "reporte_demo4", true);
  resp.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length });
  return resp.send(pdf);
};


export const imprimirChequecheques = async (
  req = request,
  resp = response
) => {
  let id_cheque: number = Number(req.params.id_cheque);

  const compras = await prisma.compras.findMany({
    where: {
      id_cheque
    },
    include: {
      Proveedor: true
    }
  });

  var contenidoHtml: any = await htmlImprimirCheque(compras);
  const jsreportUrl = 'https://reports.helixsys.dev/api/report';
 
  // const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
  // Registrar un helper para comparaciones
  // Define el payload para la solicitud a la API 
  const payload = {
    template: {
      content: contenidoHtml,
      engine: 'jsrender',
      recipe: 'chrome-pdf',
    }, 
  };  // Realiza la solicitud a la API de jsreport
  try {
    const response = await axios.post(jsreportUrl, payload, {
      responseType: 'arraybuffer',
    }); 
    resp.set({ "Content-Type": "application/pdf", "Content-Length": response.data.length });
    return resp.send(response.data);
  } catch (error) {
    console.error('Error generando el PDF:', error);
    throw new Error('No se pudo generar el PDF');
  }
 
};

export const obntenerCompra = async (req = request, resp = response) => {
  let id_compras: number = Number(req.params.id);
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  const data = await prisma.compras.findFirst({
    where: { id_compras, id_sucursal },
    include: {
      ComprasDetalle: true,
      Proveedor: true,
    },
  });

  if (!data) {
    return resp.json({
      status: false,
      msg: "La factura no existe",
      data: null,
    });
  }

  const data_sistema = await prisma.generalData.findFirst();
  return resp.json({
    status: true,
    msg: "Success",
    data,
    data_sistema,
  });
};

export const getExistencias = async (req: any, resp = response) => {
  let {
    pagina = 1,
    registrosXpagina = 10,
    query = "",
    sucursal = 0,
    bodega = 0,
  } = req.query;
  pagina = Number(pagina);
  sucursal = Number(sucursal);
  bodega = Number(bodega);
  registrosXpagina = Number(registrosXpagina);
  pagina = pagina > 0 ? pagina : 0;
  registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;

  let consultas = [];
  if (query.length > 3) {
    let array = query.split(" ");
    consultas = array.map((contains: any) => {
      return {
        AND: [
          {
            OR: [
              {
                Catalogo: { codigo: { contains } },
              },
              {
                Catalogo: { nombre: { contains } },
              },
            ],
          },
        ],
      };
    });
  }
  var wSusucursales: any = {};
  var wBodega = {};
  if (bodega > 0) {
    wBodega = { id_bodega: bodega };
  } else if (sucursal > 0) {
    var sucursales = await prisma.bodegas.findMany({
      where: { id_sucursal: sucursal, estado: "ACTIVO" },
    });

    var array = sucursales.map((e: any) => {
      return {
        id_bodega: e.id_bodega,
      };
    });

    wSusucursales = {
      OR: array,
    };
  }
  const where = {
    AND: [
      {
        existencia: {
          gte: 1,
        },
      },
      ...consultas,
    ],
    ...wBodega,
    ...wSusucursales,
  };
  const total = await prisma.inventario.count({ where });
  const registros = await prisma.inventario.findMany({
    where,
    include: { Bodegas: { include: { Sucursales: true } }, Catalogo: true },
    take: registrosXpagina,
    skip: (pagina - 1) * registrosXpagina,
  });
  const totalFiltrado = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    total,
    totalFiltrado,
    pagina,
    registrosXpagina,
    registros,
  });
};



export const verificarCompraServicio = async (req = request, resp = response) => {

  let {
    numero_factura = "",
    id_proveedor = 0,
  } = req.body;
  id_proveedor = Number(id_proveedor);
  id_proveedor = id_proveedor > 0 ? id_proveedor : null;

  var compra = await prisma.compras.findFirst({
    where: {
      id_proveedor,
      numero_factura
    }
  });

  resp.json({
    status: compra == null,
    msg: "La factura ya fue registrada ",
    data: compra,
  });
}



export const obtenerCompraServicio = async (req = request, resp = response) => {

  let id_compras: number = Number(req.params.id);

  var compra = await prisma.compras.findUnique({
    where: {
      id_compras: id_compras
    },
    include: {
      Proveedor: true
    }
  });

  resp.json({
    status: compra != null,
    msg: "Success ",
    data: compra,
  });
}
export const crearCompraServicio = async (req = request, resp = response) => {
  const { uid = 0, ids = 0 } = req.params;
  const id_usuario = Number(uid);
  try {
    let {
      numero_factura = "",
      numero_quedan = "",
      fecha_factura = new Date(),
      tipo_pago = "CONTADO",
      tipo_compra = "INTERNA",
      tipo_factura = "GRABADO",
      tipo_inventario = "MP",
      dias_credito = 0,
      id_sucursal = 0,
      detalle = "",
      iva = 0,
      cesc = 0,
      descuento = 0,
      iva_percivido = 0,
      monto = 0,
      fovial = 0,
      cotrans = 0,
      total = 0,
      id_proveedor = 0,
    } = req.body;

    id_sucursal = Number(id_sucursal);
    id_sucursal = id_sucursal > 0 ? id_sucursal : Number(ids);
    dias_credito = Number(dias_credito);
    var fecha_de_pago = new Date(fecha_factura);
    fecha_factura = new Date(fecha_factura);
    if (tipo_pago == "CREDITO" && dias_credito > 0) {
      fecha_de_pago.setDate(fecha_de_pago.getDate() + dias_credito);
    }
    const compra = await prisma.compras.create({
      data: {
        numero_factura,
        fecha_factura,
        tipo_pago,
        tipo_compra,
        tipo_factura,
        dias_credito,
        tipo_inventario,
        detalle,
        iva,
        cesc,
        iva_percivido,
        subtotal: monto,
        fovial,
        cotrans,
        total,
        id_proveedor,
        id_usuario,
        id_sucursal,
        numero_quedan,
        fecha_de_pago,
        descuento,
        estado_pago: tipo_pago == "CREDITO" ? "PENDIENTE" : "PAGADO",
      },
    });

    resp.json({
      status: true,
      msg: "Factura creada con exito",
      data: compra,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
};
export const updateCompraServicio = async (req = request, resp = response) => {
  let id_compras: number = Number(req.params.id_compra);
  const { uid = 0, ids = 0 } = req.params;
  const id_usuario = Number(uid);
  try {
    let {
      numero_factura = "",
      numero_quedan = "",
      fecha_factura = new Date(),
      tipo_pago = "CONTADO",
      tipo_compra = "INTERNA",
      tipo_factura = "GRABADO",
      tipo_inventario = "MP",
      dias_credito = 0,
      id_sucursal = 0,
      detalle = "",
      iva = 0,
      cesc = 0,
      iva_percivido = 0,
      monto = 0,
      fovial = 0,
      cotrans = 0,
      total = 0,
      id_proveedor = 0,
    } = req.body;

    id_sucursal = Number(id_sucursal);
    id_sucursal = id_sucursal > 0 ? id_sucursal : Number(ids);
    dias_credito = Number(dias_credito);
    fecha_factura = new Date(fecha_factura);
    var fecha_de_pago = new Date();
    if (tipo_pago == "CREDITO" && dias_credito > 0) {
      fecha_de_pago.setDate(fecha_de_pago.getDate() + dias_credito);
    }
    const compra = await prisma.compras.update({
      where: {
        id_compras
      },
      data: {
        numero_factura,
        fecha_factura,
        tipo_pago,
        tipo_compra,
        tipo_factura,
        dias_credito,
        tipo_inventario,
        detalle,
        iva,
        cesc,
        iva_percivido,
        subtotal: monto,
        fovial,
        cotrans,
        total,
        id_proveedor,
        id_usuario,
        id_sucursal,
        numero_quedan,
        fecha_de_pago,
        estado_pago: tipo_pago == "CREDITO" ? "PENDIENTE" : "PAGADO",
      },
    });

    resp.json({
      status: true,
      msg: "Factura actualizada con exito",
      data: compra,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
};

export const crearCompraServicioR = async (req = request, resp = response) => {
  const { uid = 0, ids = 0 } = req.params;
  const id_usuario = Number(uid);
  try {
    let {
      id_sucursal = 0,
      id_tipo_factura = 3,
      numero_factura = "",
      nombre_proveedor = "",
      tipo_inventario = "MP",
      tipo_pago = "CONTADO",
      dui_proveedor = "",
      fecha_factura = new Date(),
      detalle = "",
      monto = 0,
    } = req.body;
    var fecha_de_pago = new Date();

    id_sucursal = Number(id_sucursal);
    id_sucursal = id_sucursal > 0 ? id_sucursal : Number(ids);
    fecha_factura = new Date(fecha_factura);
    const compra = await prisma.compras.create({
      data: {
        numero_factura,
        fecha_factura,
        tipo_pago,
        dui_proveedor,
        tipo_inventario,
        detalle,
        nombre_proveedor,
        subtotal: monto,
        total: monto,
        id_usuario,
        id_sucursal,
        fecha_de_pago,
        id_tipo_factura,
        estado_pago: "PAGADO",
      },
    });
    resp.json({
      status: true,
      msg: "Compra ingresada con exito",
      data: compra,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
};
export const crearFactura = async (req = request, resp = response) => {
  try {
    let {
      id_proveedor = 0,
      id_tipo_factura = 0,
      detalle_factura = [],
      numero_factura = "",
      fecha_factura = new Date(),
      tipo_pago = "CONTADO",
      dias_credito = 0,
      id_bodega = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      iva_retenido = 0,
      iva_percivido = 0,
      total = 0,
    } = req.body;

    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    fecha_factura = new Date(fecha_factura);
    const { uid } = req.params;
    const id_usuario = Number(uid);
    if (detalle_factura == null || detalle_factura.length == 0) {
      return resp.json({
        status: false,
        msg: "La factura debe tener detalle",
        data: null,
      });
    }
    dias_credito = dias_credito > 0 ? dias_credito : null;
    var fecha_de_pago = new Date();
    if (tipo_pago == "CREDITO" && dias_credito > 0) {
      fecha_de_pago.setDate(fecha_de_pago.getDate() + dias_credito);
    }

    id_proveedor = Number(id_proveedor);
    iva_retenido = Number(iva_retenido);
    id_tipo_factura = Number(id_tipo_factura);
    id_bodega = Number(id_bodega);
    id_tipo_factura = id_tipo_factura > 0 ? id_tipo_factura : 0;
    const [facturasTipos, proveedores, bodega] = await Promise.all([
      await prisma.facturasTipos.findFirst({
        where: { id_tipo_factura, estado: "ACTIVO" },
      }),
      await prisma.proveedores.findFirst({
        where: { id_proveedor, estado: "ACTIVO" },
      }),
      await prisma.bodegas.findFirst({
        where: { id_bodega, estado: "ACTIVO" },
      }),
    ]);

    let error = "";
    if (!(id_usuario > 0)) {
      error = "Error de token, no se detecta al usuario";
    } else if (facturasTipos == null) {
      error = "Por favor seleccione un tipo de factura valido";
    } else if (proveedores == null) {
      error = "El proveedor seleccionado no es valido";
    } else if (bodega == null) {
      error = "La bodega seleccionada no es valida";
    }
    if (error.length > 0) {
      return resp.json({
        status: false,
        msg: error,
        data: null,
      });
    }

    let db_detalle = [];
    for (let index = 0; index < detalle_factura.length; index++) {
      const detalle = detalle_factura[index];
      if (
        detalle.id_catalogo != null &&
        detalle.id_catalogo > 0 &&
        detalle.costo_unitario != null &&
        detalle.costo_unitario > 0 &&
        detalle.cantidad != null &&
        detalle.cantidad > 0 &&
        detalle.subtotal != null &&
        detalle.subtotal > 0 &&
        detalle.descuento != null &&
        detalle.descuento >= 0 &&
        detalle.iva != null &&
        detalle.iva >= 0 &&
        detalle.total != null &&
        detalle.total > 0
      ) {
        db_detalle.push({
          id_compras: 0,
          id_catalogo: Number(detalle.id_catalogo),
          codigo: detalle.codigo,
          nombre: detalle.nombre,
          costo_unitario: detalle.costo_unitario,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          descuento_porcentaje:
            detalle.descuento_porcentaje > 0 ? detalle.descuento_porcentaje : 0,
          descuento_monto:
            detalle.descuento_monto > 0 ? detalle.descuento_monto : 0,
          iva: detalle.iva,
          total: detalle.total,
        });
      }
    }
    if (db_detalle.length == 0) {
      return resp.json({
        status: false,
        msg: "El detalle de la factura esta incorrecto",
        data: null,
      });
    }
    const compra = await prisma.compras.create({
      data: {
        id_proveedor,
        numero_factura,
        tipo_pago,
        fecha_factura,
        subtotal,
        descuento,
        iva,
        iva_retenido,
        iva_percivido,
        total,
        id_usuario,
        dias_credito,
        id_bodega,
        id_sucursal,
        fecha_de_pago,
        estado_pago: tipo_pago == "CREDITO" ? "PENDIENTE" : "PAGADO",
      },
    });
    if (compra == null) {
      return resp.json({
        status: false,
        msg: "Ha ocurrido un error al crear la factura favor intentarlo mas tarde",
        data: null,
      });
    }
    db_detalle = db_detalle.map((e) => {
      e.id_compras = compra.id_compras;
      return e;
    });
    //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta

    var detalleCompra = await prisma.comprasDetalle.createMany({
      data: db_detalle,
    });

    if (detalleCompra.count > 0) {
      await procesarInKardex(compra.id_compras);
    }

    const facturaCreada = await prisma.compras.findUnique({
      where: { id_compras: compra.id_compras },
      include: {
        ComprasDetalle: true,
        Proveedor: true,
        Bodegas: true,
      },
    });
    resp.json({
      status: true,
      msg: "Factura creada con exito",
      data: facturaCreada,
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

const procesarInKardex = async (id_compras: number) => {
  const compra = await prisma.compras.findUnique({
    where: { id_compras: id_compras },
    include: {
      ComprasDetalle: true,
      Proveedor: true,
      Bodegas: true,
    },
  });

  if (compra != null) {
    let descripcion =
      "Ingreso por compra con numero de factura #" + compra.numero_factura;
    var id_bodega = compra.id_bodega;
    let dataKardex = [];
    for (let index = 0; index < compra.ComprasDetalle.length; index++) {
      const element = compra.ComprasDetalle[index];
      let id_catalogo = element.id_catalogo ?? 0;
      let id_compras_detalle = element.id_compras_detalle ?? 0;
      let costo = element.costo_unitario ?? 0;
      let costo_promedio = element.costo_unitario ?? 0;
      let cantidad = element.cantidad ?? 0;
      let inventario = element.cantidad ?? 0;
      let subtotal = element.subtotal ?? 0;
      let total = element.total ?? 0;
      let tipo_movimiento = 1; // Entrada
      var kardexItem = await prisma.kardex.findFirst({
        where: { id_catalogo },
        orderBy: { id_kardex: "desc" },
        take: 1,
      });

      if (kardexItem != null) {
        let totalK = kardexItem.total ?? 0;
        let existenciaK = kardexItem.inventario ?? 0;
        let totalIng = element.total ?? 0;
        costo_promedio = (totalK + totalIng) / (existenciaK + cantidad);
        inventario += existenciaK;
        total += totalK;
      }
      dataKardex.push({
        id_catalogo,
        id_compras_detalle,
        tipo_movimiento,
        descripcion,
        costo,
        cantidad,
        subtotal,
        costo_promedio,
        inventario,
        total,
      });

      var invRegistro = await prisma.inventario.findFirst({
        where: { id_catalogo, existencia: { gte: 1 }, id_bodega },
        orderBy: { id_inventario: "desc" },
        take: 1,
      });

      if (invRegistro != null) {
        var existencia = (invRegistro.existencia ?? 0) + cantidad;
        await prisma.inventario.update({
          where: { id_inventario: invRegistro.id_inventario },
          data: {
            costo_unitario: costo_promedio,
            existencia,
            costo_total: costo_promedio * existencia,
          },
        });
      } else {
        await prisma.inventario.create({
          data: {
            id_catalogo,
            id_compras_detalle,
            id_bodega,
            costo_unitario: costo_promedio,
            existencia: cantidad,
            costo_total: costo_promedio * cantidad,
          },
        });
      }
    }

    await prisma.kardex.createMany({
      data: dataKardex,
    });
  }
};
