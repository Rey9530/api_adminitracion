import expres from "express";
const response = expres.response;
const request = expres.request;
import { PrismaClient } from "@prisma/client";
import readXlsxFile from "read-excel-file/node";
const prisma = new PrismaClient();


//TODO: Bueno haber en que se utiliza
export const getData = async (req = request, resp = response) => {
  console.log(req.params);
  console.log(__dirname);
  await prisma.usuarios.findMany();
  await leerexcel(__dirname + "/../../uploads/CXP.xlsx");
  // var respDb = await prisma.compras.createMany({
  //   data: datos,
  // })
  resp.json({
    status: true,
    // usuarios,
    msg: "data",
    // datos,
  });
};


const leerexcel = async (path: any) => {
  return new Promise((resolve, _) => {
    readXlsxFile(path).then(async (rows) => {
      var datos: any = [];
      for (let index = 1; index < rows.length; index++) {
        const element = rows[index];
        var id_sucursal = Number(element[0]);
        var numero_quedan = element[1].toString();
        var fecha = element[2].toString();
        var numero_factura = element[3].toString();
        var id_proveedor = Number(element[4]);// element[4];
        var detalle = element[5].toString();
        var subtotal = Number(element[6]);
        var iva = Number(element[7]);
        var total = Number(element[8]);
        var iva_percivido = Number(element[9]);
        var fecha_ = new Date((Number(fecha) - (25567 + 2)) * 86400 * 1000);
        var fecha_de_pago = new Date((Number(fecha) - (25567 + 2)) * 86400 * 1000);
        fecha_de_pago.setDate(fecha_de_pago.getDate() + 30);
        var data:any = { 
            tipo_pago: "CREDITO",
            id_sucursal,
            dias_credito: 30,
            numero_quedan,
            fecha_factura: fecha_,
            fecha_de_pago,
            numero_factura,
            id_proveedor,
            detalle, 
            subtotal,
            iva,
            total,
            iva_percivido,
            id_usuario: 1,
          };
        // await prisma.compras.create({data})
        console.log(data);
      }
      resolve(datos);
    });
  }).then((resp) => {
    return resp;
  });
};