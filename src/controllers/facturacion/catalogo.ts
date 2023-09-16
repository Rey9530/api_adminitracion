import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
import { eliminarArchivoCloudinary, subirArchivo } from "../utils";
const prisma = new PrismaClient();

export const getRegistros = async (req: any, resp = response) => {
  let { pagina = 1, registrosXpagina = 10, query = "" } = req.query;
  pagina = Number(pagina);
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
              { codigo: { contains } },
              { nombre: { contains } },
              { descripcion: { contains } },
            ],
          },
        ],
      };
    });
  }
  const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
  const total = await prisma.catalogo.count({ where });
  const registros = await prisma.catalogo.findMany({
    where,
    select: {
      Tipo: true,
      Categorias: true,
      codigo: true,
      descripcion: true,
      estado: true,
      existencias_maximas: true,
      existencias_minimas: true,
      fecha_creacion: true,
      foto_url: true,
      id_catalogo: true,
      id_categoria: true,
      id_tipo: true,
      nombre: true,
      precio_con_iva: true,
      precio_sin_iva: true,
    },
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
export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const registros = await prisma.catalogo.findFirst({
    where: { id_catalogo: uid, estado: "ACTIVO" },
    include: { Tipo: true, Categorias: true },
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
    precio_con_iva = 0,
    precio_sin_iva = 0,
    existencias_minimas = 0,
    existencias_maximas = 0,
  } = req.body;
  try {
    id_tipo = Number(id_tipo);
    id_categoria = Number(id_categoria);
    precio_con_iva = Number(precio_con_iva);
    precio_sin_iva = Number(precio_sin_iva);
    existencias_minimas = Number(existencias_minimas);
    existencias_maximas = Number(existencias_maximas);
    let respImagen: any = {};
    if (req.files && Object.keys(req.files).length > 0) {
      respImagen = await subirArchivo(req.files);
    }
    let foto_obj = JSON.stringify(respImagen);
    let foto_url = respImagen.secure_url ? respImagen.secure_url : "";


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
    const data: any = await prisma.catalogo.create({
      data: {
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        foto_obj,
        foto_url,
        precio_con_iva,
        precio_sin_iva,
        existencias_minimas,
        existencias_maximas,
      },
    });
    delete data.foto_obj;
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
    });
  } catch (error) {
    console.log(error)
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
      precio_con_iva = 0,
      precio_sin_iva = 0,
      existencias_minimas = 0,
      existencias_maximas = 0
    } = req.body;

    id_tipo = Number(id_tipo);
    id_categoria = Number(id_categoria);
    precio_con_iva = Number(precio_con_iva);
    precio_sin_iva = Number(precio_sin_iva);
    existencias_minimas = Number(existencias_minimas);
    existencias_maximas = Number(existencias_maximas);
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

    let foto_obj: any = registro.foto_obj;
    let foto_url = registro.foto_url;
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        let respn: any = await subirArchivo(req.files);
        foto_obj = JSON.stringify(respn);
        foto_url = respn.secure_url;
        if (
          registro.foto_obj != "" &&
          registro.foto_obj != "{}" &&
          registro.foto_obj != null &&
          registro.foto_obj.length > 0
        ) {
          let imagenActual = JSON.parse(registro.foto_obj);
          await eliminarArchivoCloudinary(imagenActual.public_id);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const registroActualizado = await prisma.catalogo.update({
      where: { id_catalogo: uid },
      data: { 
        id_tipo,
        id_categoria,
        codigo,
        nombre,
        descripcion,
        foto_obj,
        foto_url,
        precio_con_iva,
        precio_sin_iva,
        existencias_minimas,
        existencias_maximas
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
