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
              { nombre: { contains } },
              { giro: { contains } },
              { razon_social: { contains } },
              { registro_nrc: { contains } },
              { nit: { contains } },
              { direccion: { contains } },
              { telefono: { contains } },
              { correo: { contains } },
              { dui: { contains } },
            ],
          },
        ],
      };
    });
  }
  const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
  const total = await prisma.cliente.count();
  const data = await prisma.cliente.findMany({
    where,
    include: { Municipio: true },
    take: registrosXpagina,
    skip: (pagina - 1) * registrosXpagina,
  });
  const totalFiltrado = await data.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    total,
    totalFiltrado,
    pagina,
    registrosXpagina,
    data,
  });
};
export const getRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  uid = uid > 0 ? uid : 0;
  const registros = await prisma.cliente.findFirst({
    where: { id_cliente: uid, estado: "ACTIVO" },
    include: { Municipio: true },
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
    nombre = "",
    giro = "",
    razon_social = "",
    registro_nrc = "",
    nit = "",
    id_municipio = 0,
    direccion = "",
    telefono = "",
    correo = "",
    dui = "",
  } = req.body;
  try {
    let respImagen: any = {};
    if (req.files && Object.keys(req.files).length > 0) {
      respImagen = await subirArchivo(req.files);
    }
    let foto_obj_nrc = JSON.stringify(respImagen);
    let foto_url_nrc = respImagen.secure_url ? respImagen.secure_url : "";

    id_municipio = Number(id_municipio);
    if (id_municipio > 0) {
      const municipio = await prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) {
        return resp.status(400).json({
          status: false,
          msg: "El municipio seleccionado no existe ",
        });
      }
    } else {
      id_municipio = null;
    }
    const data = await prisma.cliente.create({
      data: {
        nombre,
        giro,
        razon_social,
        registro_nrc,
        foto_url_nrc,
        foto_obj_nrc,
        nit,
        id_municipio,
        direccion,
        telefono,
        correo,
        dui,
      },
      select: {
        id_cliente: true,
        nombre: true,
        giro: true,
        razon_social: true,
        registro_nrc: true,
        foto_url_nrc: true,
        nit: true,
        Municipio: { include: { Departamento: true } },
        direccion: true,
        telefono: true,
        correo: true,
        dui: true,
      },
    });
    resp.json({
      status: true,
      msg: "Registro creado con Éxito",
      data,
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

export const actualizarRegistro = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  uid = uid > 0 ? uid : 0;
  try {
    const registro = await prisma.cliente.findFirst({
      where: { id_cliente: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    let {
      nombre = "",
      giro = "",
      razon_social = "",
      nit = "",
      id_municipio = 0,
      direccion = "",
      telefono = "",
      correo = "",
      dui = "",
      registro_nrc=""
    } = req.body;

    let foto_obj_nrc: any = registro.foto_obj_nrc;
    let foto_url_nrc = registro.foto_url_nrc;
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        let respn: any = await subirArchivo(req.files);
        foto_url_nrc = respn.secure_url;
        foto_obj_nrc = JSON.stringify(respn);
        if (
          registro.foto_obj_nrc != "" &&
          registro.foto_obj_nrc != "{}" &&
          registro.foto_obj_nrc != null &&
          registro.foto_obj_nrc.length > 0
        ) {
          let imagenActual = JSON.parse(registro.foto_obj_nrc);
          await eliminarArchivoCloudinary(imagenActual.public_id);
        }
      } catch (error) {
        console.log(error);
      }
    }

    id_municipio = Number(id_municipio);
    if (id_municipio > 0) {
      const municipio = await prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) {
        return resp.status(400).json({
          status: false,
          msg: "El municipio seleccionado no existe ",
        });
      }
    } else {
      id_municipio = null;
    }
    const registroActualizado = await prisma.cliente.update({
      where: { id_cliente: uid },
      data: {
        nombre,
        giro,
        razon_social,
        registro_nrc,
        nit,
        foto_url_nrc,
        foto_obj_nrc,
        id_municipio,
        direccion,
        telefono,
        correo,
        dui,
      },
      select: {
        id_cliente: true,
        nombre: true,
        giro: true,
        razon_social: true,
        Municipio: { include: { Departamento: true } },
        registro_nrc: true,
        nit: true,
        id_municipio: true,
        direccion: true,
        telefono: true,
        correo: true,
        dui: true,
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
  uid = uid > 0 ? uid : 0;
  try {
    const registro = await prisma.cliente.findFirst({
      where: { id_cliente: uid, estado: "ACTIVO" },
    });
    if (!registro) {
      return resp.status(400).json({
        status: false,
        msg: "El registro no existe",
      });
    }
    await prisma.cliente.update({
      data: { estado: "INACTIVO" },
      where: { id_cliente: uid },
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
