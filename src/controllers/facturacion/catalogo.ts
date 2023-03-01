import expres from "express";
const response = expres.response;
const request = expres.request; 
import bcrypt from "bcryptjs";  
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUsuarios = async (__: any, resp = response) => {
  const usuarios = await prisma.usuarios.findMany({
    where: { estado: "ACTIVO" },
  });
  const total = await usuarios.length;
  resp.json({
    status: true,
    msg: "Usuario",
    usuarios,
    total,
  });
};
export const getUsuario = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  const usuario = await prisma.usuarios.findFirst({
    where: { id: uid, estado: "ACTIVO" },
  });

  if (!usuario) {
    resp.status(400).json({
      status: false,
      msg: "El usuario no existe o esta deshabilitado",
    });
  } else {
    resp.json({
      status: true,
      msg: "Usuario",
      usuario,
    });
  }
};

export const crearUsuario = async (req = request, resp = response) => {
  let { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal } =
    req.body;
  try {
    const existeRol = await prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      return resp.status(400).json({
        status: false,
        msg: "El registro del rol no existe",
      });
    }
    const existeSucursal = await prisma.sucursales.findUnique({
      where: { id_sucursal },
    });
    if (!existeSucursal) {
      return resp.status(400).json({
        status: false,
        msg: "El registro de la sucursal no existe",
      });
    }

    const existeEmail = await prisma.usuarios.findFirst({
      where: {
        usuario
      },
    });
    if (existeEmail) {
      return resp.status(400).json({
        status: true,
        msg: usuario + " ya existe",
      });
    }
    //encriptar clave
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    const userSaved = await prisma.usuarios.create({
      data: {
        usuario,
        password,
        nombres,
        apellidos,
        dui,
        id_rol,
        id_sucursal,
      },
    });

    const token =" await getenerarJWT(userSaved.id)";

    resp.json({
      status: true,
      msg: "Crear usuario",
      data: { ...userSaved, token },
    });
  } catch (error) {
    resp.status(500).json({
      status: false,
      msg: "Error inesperado reviosar log",
    });
  }
  return;
};
export const actualizarUsuario = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    const existeEmail = await prisma.usuarios.findFirst({
      where: { id: uid ,estado: "ACTIVO"},
    });
    if (!existeEmail) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario no existe o esta deshabilitado",
      });
    }

    const { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal } =
      req.body;
    if (existeEmail.usuario != usuario) {
      const existeEmail = await prisma.usuarios.findFirst({
        where: { usuario },
      });
      if (existeEmail) {
        return resp.status(400).json({
          status: true,
          msg: "Ya existe un registro con ese usuario",
        });
      }
    }

    const existeRol = await prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      return resp.status(400).json({
        status: false,
        msg: "El registro del rol no existe",
      });
    }
    const existeSucursal = await prisma.sucursales.findUnique({
      where: { id_sucursal },
    });
    if (!existeSucursal) {
      return resp.status(400).json({
        status: false,
        msg: "El registro de la sucursal no existe",
      });
    }

    const usuarioUpdate = await prisma.usuarios.update({
      where: { id: uid },
      data: { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal },
    });
    resp.json({
      status: true,
      msg: "Usuario Actualizado",
      usuario: usuarioUpdate,
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

export const eliminarUsuarios = async (req = request, resp = response) => {
  let uid: number = Number(req.params.id);
  try {
    const existeEmail = await prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) {
      return resp.status(400).json({
        status: false,
        msg: "El usuario no existe o ya esta deshabilitado",
      });
    }
    await prisma.usuarios.update({
      data: { estado: "INACTIVO" },
      where: { id: uid },
    });
    resp.json({
      status: true,
      msg: "Usuario elimiando",
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
