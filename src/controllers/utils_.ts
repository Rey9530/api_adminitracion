import expres from "express";
const response = expres.response;
const request = expres.request;
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import readXlsxFile from "read-excel-file/node";
const prisma = new PrismaClient();
const pdf = require("html-pdf");

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

export const getPdf = async (_ = request, resp = response) => {
  const ubicacionPlantilla = require.resolve("./../html/emails/cierres_plantilla.html");
  let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf8');
  // Podemos acceder a la petición HTTP 
  contenidoHtml = contenidoHtml.replace("{{sucursal}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{fecha}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{venta_bruta}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{para_llevar}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{efectivo}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{t_credomatic}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{t_sefinza}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{t_promerica}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{t_total}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{bitcoin}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{syke}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{total_restante}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{propina}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{venta_iva}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{cortecia}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{anticipos_cobrados}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{anticipos_reservas}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{certificados_regalo}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{hugo_app}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{pedidos_ya}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{compras}}", "$1.00");
  contenidoHtml = contenidoHtml.replace("{{entrega_efectivo}}", "$1.00");
  pdf.create(contenidoHtml).toStream((error: any, stream: any) => {
    if (error) {
      resp.end("Error creando PDF: " + error)
    } else {
      resp.setHeader("Content-Type", "application/pdf");
      stream.pipe(resp);
    }
  });
};

export const getHtml = async (_ = request, resp = response) => {
  const ubicacionPlantilla = require.resolve("./../html/emails/cierres_plantilla.html");
  let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf8');
  // Podemos acceder a la petición HTTP
  const valorPasadoPorNode = "Soy un valor pasado desde JavaScript";
  contenidoHtml = contenidoHtml.replace("{{valor}}", valorPasadoPorNode);
  resp.send(contenidoHtml);
  // pdf.create(contenidoHtml).toStream((error: any, stream: any) => {
  //   if (error) {
  //     resp.end("Error creando PDF: " + error)
  //   } else {
  //     resp.setHeader("Content-Type", "application/pdf");
  //     stream.pipe(resp);
  //   }
  // });
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
        var data: any = {
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