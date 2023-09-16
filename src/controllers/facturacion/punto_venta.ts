import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProdctosByCategorys = async (req = request, resp = response) => {
  var id_usuario: any = Number(req.params.uid);
  console.log(id_usuario);
  const registros = await prisma.catalogoCategorias.findMany({
    where: { estado: "ACTIVO", },
    include: { catalogo: true },
    orderBy:{
      nombre:'asc'
    }
  });
  const total = await registros.length;
  resp.json({
    status: true,
    msg: "Listado de registros",
    registros,
    total,
  });
};
