import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crearFactura = async (req = request, resp = response) => {
  try {
    let {
      cliente = "",
      direccion = "",
      no_registro = "",
      nit = "",
      giro = "",
      id_municipio = 0,
      id_tipo_factura = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      total = 0,
      detalle_factura = [],
    } = req.body;
    if (detalle_factura == null || detalle_factura.length == 0) {
      return resp.json({
        status: false,
        msg: "La factura debe tener detalle",
        data: null,
      });
    }

    const [tipoFactura, municipio] = await Promise.all([
      await prisma.facturasTipos.findFirst({
        where: { id_tipo_factura },
        include: { Bloques: { where: { estado: "ACTIVO" } } },
      }),
      await prisma.municipios.findUnique({
        where: { id_municipio },
      }),
    ]);

    let error = "";
    if (municipio == null) {
      error = "El municipio no es existe";
    } else if (tipoFactura == null) {
      error = "El tipo de factura no existe";
    } else if (tipoFactura.Bloques.length == 0) {
      error = "El tipo de factura no tiene un bloque activo asignado";
    } else if (tipoFactura.Bloques[0].actual > tipoFactura.Bloques[0].hasta) {
      error =
        "El bloque de facturas ha finalizado, configure uno nuevo para continuar.";
        await prisma.facturasBloques.update({
          data: { estado:'INACTIVO' },
          where: { id_bloque:tipoFactura.Bloques[0].id_bloque },
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
        detalle.iva > 0 &&
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
