import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNumeroFactura = async (req = request, resp = response) => {
  let id_tipo_factura: number = Number(req.params.id);
  if (!(id_tipo_factura > 0)) {
    return resp.json({
      status: false,
      msg: "El tipo de factura es incorrecto",
      data: null,
    });
  }
  let tipoFactura: any = await prisma.facturasTipos.findFirst({
    where: { id_tipo_factura },
    include: { Bloques: { where: { estado: "ACTIVO" }, take: 1 } },
  });
  if (tipoFactura == null || tipoFactura.Bloques.length == 0) {
    return resp.json({
      status: false,
      msg: "No existe un bloque de facturas configurado para este tipo de factura ",
      data: null,
    });
  } else {
    tipoFactura.Bloques = tipoFactura.Bloques[0];
    return resp.json({
      status: true,
      msg: "Success",
      data: tipoFactura,
    });
  }
};

export const buscarEnCatalogo = async (req = request, resp = response) => {
  let { query = "" } = req.body;
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
    },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const obntenerMetodosDePago = async (_ = request, resp = response) => {
  const data = await prisma.facturasMetodosDePago.findMany({
    where: { estado: "ACTIVO" },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const obntenerDepartamentos = async (_ = request, resp = response) => {
  const data = await prisma.departamentos.findMany({
    where: { estado: "ACTIVO" },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const obntenerMunicipios = async (req = request, resp = response) => {
  let id_departamento: number = Number(req.params.id);
  const data = await prisma.municipios.findMany({
    where: { estado: "ACTIVO", id_departamento },
  });
  return resp.json({
    status: true,
    msg: "Success",
    data,
  });
};

export const crearFactura = async (req = request, resp = response) => {
  try {
    let {
      cliente = "",
      direccion = "",
      no_registro = "",
      nit = "",
      giro = "",
      id_municipio = null,
      id_tipo_factura = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      total = 0,
      efectivo = 0,
      tarjeta = 0,
      cheque = 0,
      transferencia = 0,
      credito = 0,
      id_metodo_pago = 0,
      id_descuento = null,
      detalle_factura = [],
    } = req.body;
    if (detalle_factura == null || detalle_factura.length == 0) {
      return resp.json({
        status: false,
        msg: "La factura debe tener detalle",
        data: null,
      });
    }
    efectivo = Number(efectivo);
    tarjeta = Number(tarjeta);
    cheque = Number(cheque);
    transferencia = Number(transferencia);
    credito = Number(credito);
    id_municipio = Number(id_municipio);
    id_descuento = id_descuento > 0 ? id_descuento : null;
    id_municipio = id_municipio > 0 ? id_municipio : null;

    const tipoFactura = await prisma.facturasTipos.findFirst({
      where: { id_tipo_factura },
      include: { Bloques: { where: { estado: "ACTIVO" } } },
    });

    let error = "";
    if (tipoFactura == null) {
      error = "El tipo de factura no existe";
    } else if (tipoFactura.Bloques.length == 0) {
      error = "El tipo de factura no tiene un bloque activo asignado";
    } else if (tipoFactura.Bloques[0].actual > tipoFactura.Bloques[0].hasta) {
      error =
        "El bloque de facturas ha finalizado, configure uno nuevo para continuar.";
      await prisma.facturasBloques.update({
        data: { estado: "INACTIVO" },
        where: { id_bloque: tipoFactura.Bloques[0].id_bloque },
      });
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
        detalle.nombre != null &&
        detalle.nombre.length > 0 &&
        detalle.id_catalogo != null &&
        detalle.id_catalogo > 0 &&
        detalle.precio_sin_iva != null &&
        detalle.precio_sin_iva > 0 &&
        detalle.precio_con_iva != null &&
        detalle.precio_con_iva > 0 &&
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
          id_factura: 0,
          id_catalogo: detalle.id_catalogo,
          codigo: detalle.codigo,
          nombre: detalle.nombre,
          precio_sin_iva: detalle.precio_sin_iva,
          precio_con_iva: detalle.precio_con_iva,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          descuento: detalle.descuento,
          id_descuento:
            (detalle.id_descuento != null && detalle.id_descuento) > 0
              ? detalle.id_descuento
              : null,
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
    const bloque = tipoFactura?.Bloques[0];
    const id_bloque = tipoFactura?.Bloques[0].id_bloque;
    const numero_factura = bloque?.actual.toString();
    const factura = await prisma.facturas.create({
      data: {
        cliente,
        numero_factura,
        direccion,
        no_registro,
        nit,
        giro,
        id_municipio,
        id_bloque,
        efectivo,
        id_descuento,
        tarjeta,
        cheque,
        transferencia,
        credito,
        id_metodo_pago,
        subtotal,
        descuento,
        iva,
        total,
      },
    });
    if (factura == null) {
      return resp.json({
        status: false,
        msg: "Ha ocurrido un error al crear la factura favor intentarlo mas tarde",
        data: null,
      });
    }
    db_detalle = db_detalle.map((e) => {
      e.id_factura = factura.id_factura;
      return e;
    });
    //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta
    await prisma.facturasBloques.update({
      data: { actual: bloque!.actual + 1 },
      where: { id_bloque },
    });
    await prisma.facturasDetalle.createMany({
      data: db_detalle,
    });
    const facturaCreada = await prisma.facturas.findUnique({
      where: { id_factura: factura.id_factura },
      include: {
        FacturasDetalle: true,
        Bloque: {
          select: {
            Tipo: { select: { nombre: true } },
            tira: true,
            serie: true,
          },
        },
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
