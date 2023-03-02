import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRegistros = async (__: any, resp = response) => {
  const registros = await prisma.catalogo.findMany({
    where: { estado: "ACTIVO" },
    include:{ Tipo:true,Categorias:true }
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};
export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.catalogo.findFirst({
    where: { id_catalogo: uid, estado: "ACTIVO" },
    include:{ Tipo:true,Categorias:true }
  });

  if (!registros) {
    resp.status(400).json({
      status: false,
      msg: "El registro no existe",
    });
  } else {
    resp.json({
      status: true,
      msg: "Exito",
      registros,
    });
  }
};

export const crearRegistro = async (req = request, resp = response) => {
  let {
    id_tipo = 0,
    id_categoria = 0,
    codigo = "0000",
    nombre = "",
    descripcion = "",
    precio = 0,
  } = req.body;
  try {
    const [tipo, categoria] = await Promise.all([
      await prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]); 
    if (!tipo) {
      return resp.status(400).json({
        status: false,
        msg: "El tipo no existe ",
      });
    }
    if (!categoria) {
      return resp.status(400).json({
        status: false,
        msg: "La categoria no existe",
      });
    }
    const data = await prisma.catalogo.create({
      data: {
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        precio,
      },
    });
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};

export const actualizarRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    const registro = await prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let {
      id_tipo = 0,
      id_categoria = 0,
      codigo = "0000",
      nombre = "",
      descripcion = "",
      precio = 0,
    } = req.body;  
    const [tipo, categoria] = await Promise.all([
      await prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]); 
    if (!tipo) {
      return resp.status(400).json({
        status: false,
        msg: "El tipo no existe ",
      });
    }
    if (!categoria) {
      return resp.status(400).json({
        status: false,
        msg: "La categoria no existe",
      });
    }
    const registroActualizado = await prisma.catalogo.update({
      where: { id_catalogo: uid },
      data: {
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        precio,
      },
    });
    resp.json({
      status: true,
      msg: "Registro Actualizado",
      data: registroActualizado,
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

export const eliminarRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    const registro = await prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.catalogo.update({
      data: { estado: "INACTIVO" },
      where: { id_catalogo: uid },
    });
    resp.json({
      status: true,
      msg: "Registro elimiando",
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
