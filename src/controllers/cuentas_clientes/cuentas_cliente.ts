import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crearCuenta = async (req = request, resp = response) => {
  try {
    let { nombre = "", nota = "", numero_clientes = "", id_mesa = 0 } = req.body;
    var mesa = await prisma.mesas.findFirst({
      where: { id_mesa, estado: "ACTIVO" },
    });
    if (!mesa) {
      return resp.status(400).json({
        status: false,
        msg: "La mesa seleccionada es incorrecta",
      });
    }
    var db = await prisma.cuentasClientes.create({
      data: {
        nombre,
        nota,
        numero_clientes,
      }
    });
    await prisma.mesas.update({
      data: {
        id_cuenta: db.id_cuenta
      },
      where: {
        id_mesa
      }
    });
    return resp.json({
      status: db ? true : false,
      msg: db ? "Cuenta creada" : "Error al crear la cuenta",
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      status: false,
      msg: "Ha ocurrido un error revisar logs",
    });
  }
};


export const crearorden = async (req = request, resp = response) => {
  try {
    let id_cuenta: number = Number(req.params.id_orden);
    let { detalle = [] } = req.body;
    var cuenta = await prisma.cuentasClientes.findFirst({
      where: { id_cuenta, },
    });
    if (!cuenta) {
      return resp.status(400).json({
        status: false,
        msg: "La cuenta no existe",
      });
    }
    var arrayDb = [];
    for (let index = 0; index < detalle.length; index++) {
      const element = detalle[index];
      arrayDb.push(
        {
          costo_unitario: element.precio_con_iva,
          cantidad: element.cantidad,
          total: Number(element.cantidad) * Number(element.precio_con_iva),
          id_cuenta,
          id_catalogo: element.id_catalogo,
        }
      );
    }
    var db = await prisma.cuentasClientesDetalle.createMany({
      data: arrayDb
    });
    return resp.json({
      status: db.count > 0 ? true : false,
      msg: db.count > 0 ? "Orden creada" : "Error al crear la Orden",
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      status: false,
      msg: "Ha ocurrido un error revisar logs",
    });
  }
};

export const obtenerOrdenes = async (req = request, resp = response) => {
  try {
    let id_cuenta: number = Number(req.params.id_orden);
    var cuenta = await prisma.cuentasClientes.findFirst({
      where: { id_cuenta, },
    });
    if (!cuenta) {
      return resp.status(400).json({
        status: false,
        msg: "La cuenta no existe",
      });
    }


    const [cuentas, total] = await Promise.all([
      await prisma.cuentasClientesDetalle.findMany({
        where: { id_cuenta, },
        include: { Catalogo: { include: { Categorias: true } } }
      }),
      await prisma.cuentasClientesDetalle.aggregate({
        _sum: { total: true },
        where: { id_cuenta, },
      }),
    ]);
    return resp.json({
      status: cuentas.length > 0 ? true : false,
      msg: cuentas.length > 0 ? "Listado de Ordenes" : "Error al obtener el Listado de Ordenes",
      data: cuentas,
      total: total._sum.total
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      status: false,
      msg: "Ha ocurrido un error revisar logs",
    });
  }
};


export const eliminaDetalleOrdenes = async (req = request, resp = response) => {
  try {
    let id_cuenta_detalle: number = Number(req.params.id_orden);
    var orden = await prisma.cuentasClientesDetalle.findFirst({
      where: { id_cuenta_detalle, },
    });
    if (!orden) {
      return resp.status(400).json({
        status: false,
        msg: "La registro no existe",
      });
    }
    var respDb = await prisma.cuentasClientesDetalle.delete({
      where: { id_cuenta_detalle, },
      include: { Catalogo: { include: { Categorias: true } } }
    })
    return resp.json({
      status: true,
      msg: respDb.Catalogo.nombre + " fue eliminado ",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      status: false,
      msg: "Ha ocurrido un error revisar logs",
    });
  }
};


export const cerrarCuenta = async (req = request, resp = response) => {
  try {
    let id_cuenta: number = Number(req.params.id_cuenta);
    var cuenta = await prisma.cuentasClientes.findFirst({
      where: { id_cuenta, },
    });
    if (!cuenta) {
      return resp.status(400).json({
        status: false,
        msg: "La registro no existe",
      });
    }

    var total = await prisma.cuentasClientesDetalle.aggregate({
      _sum: { total: true },
      where: { id_cuenta, },
    });
    await Promise.all([
      await prisma.cuentasClientes.update({
        where: { id_cuenta, },
        data: {
          total: total._sum.total,
          estado: "CERRADA",
        }
      }),
      await prisma.mesas.updateMany({
        where: { id_cuenta: cuenta.id_cuenta },
        data: {
          id_cuenta: null
        }
      })
    ]);
    return resp.json({
      status: true,
      msg: " Cuenta Cerrada ",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return resp.status(400).json({
      status: false,
      msg: "Ha ocurrido un error revisar logs",
    });
  }
}; 