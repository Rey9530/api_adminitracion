import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

export const obntenerFactura = async (req = request, resp = response) => {
  let id_factura: number = Number(req.params.id);
  let { ids = 0 } = req.params;
  let id_sucursal = Number(ids);
  const data = await prisma.facturas.findFirst({
    where: { id_factura, id_sucursal },
    include: {
      FacturasDetalle: true,
      Bloque: {
        select: {
          Tipo: { select: { nombre: true, id_tipo_factura: true } },
          tira: true,
          serie: true,
        },
      },
      Municipio: { select: { nombre: true, Departamento: true } },
      Metodo: true,
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

export const crearCompraServicio = async (req = request, resp = response) => {
  const { uid } = req.params;
  const id_usuario = Number(uid);
  try {
    let {
      numero_factura = "",
      fecha_factura = new Date(),
      tipo_pago = "CONTADO",
      tipo_compra = "INTERNA",
      tipo_factura = "GRABADO",
      dias_credito = 0,
      detalle = "",
      iva = 0,
      cesc = 0,
      iva_percivido = 0,
      monto = 2,
      fovial = 0,
      cotrans = 0,
      total = 0,
      id_proveedor = 0,
    } = req.body;

    fecha_factura = new Date(fecha_factura);
    const compra = await prisma.compras.create({
      data: {
        numero_factura,
        fecha_factura,
        tipo_pago,
        tipo_compra,
        tipo_factura,
        dias_credito,
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

    fecha_factura = new Date(fecha_factura);
    dias_credito = dias_credito > 0 ? dias_credito : null;
    const { uid } = req.params;
    const id_usuario = Number(uid);
    if (detalle_factura == null || detalle_factura.length == 0) {
      return resp.json({
        status: false,
        msg: "La factura debe tener detalle",
        data: null,
      });
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
