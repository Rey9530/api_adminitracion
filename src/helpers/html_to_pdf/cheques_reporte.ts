import { formatNumber } from "../format_number";
import fs from "fs";
import { numeroALetras } from "../monto_a_letras";

export const htmlReporteCheques = async (datos: any) => {
  var html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte</title>
    <style>
    table,th,td {
      border: 0.2px solid black;
      border-collapse: collapse;
    }
    td { 
      font-size:10px; 
    }
    th { 
      font-size:12px;
      font-weight: bold; 
    }
    </style>
</head>
<body>
<h2 style="margin:0;">Reporte de Pre-Cheques</h2>
<table   id="table_id" style="width:100%; ">
<thead>
  <tr> 
    <th scope="col" style="width: 2%">#</th>
    <th scope="col" style="width: 15%">Nombre del proveedor</th>
    <th scope="col" style="width: 10%">Monto total</th>
    <th scope="col" style="width: 20%">No. Cuenta</th>
    <th scope="col" style="width: 15%">Banco</th>
    <th scope="col" style="width: 20%">Tipo Cuenta</th> 
  </tr>
</thead>
`;
  for (let index = 0; index < datos.length; index++) {
    const data = datos[index];
    html += `
    <tbody *ngFor= >
      <tr> 
         <td align="center">`+ (index + 1) + `</td>
        <td align="center">`+ data.proveedor + `</td>
        <td align="right">`+ formatNumber(data.monto) + `</td>
        <td align="right">`+ data.no_cuenta + `</td>
        <td align="right">`+ data.banco + `</td>
        <td align="right">`+ data.tipo_cuenta + `</td>
      </tr>
      <tr>
        <td colspan="8" style="border-top: none!important;">
          <table class="table_" style="  width:100%; ">
            <thead>
              <tr>
                <th>#</th>
                <th>No. Factura</th>
                <th>No. Quedan</th>
                <th>No. Cheque</th>
                <th>Fecha</th>
                <th>Tipo de Compra</th>
                <th>Estado Compra</th>
                <th>Sucursal</th>
                <th>Detalle</th>
                <th>Tipo Inventario</th>
                <th>Sub Total</th>
                <th>IVA</th>
                <th>TOTAL</th>
                <th>1% Percibidos</th> 
              </tr>
            </thead>
            <tbody>
            `;

    for (let o = 0; o < data.compras.length; o++) {
      const item = data.compras[o];
      var fecha = new Date(item.fecha_factura).toLocaleString().split(",");
      html += ` 
                <tr> 
                    <td>`+ (o + 1) + `</td>
                    <td>`+ item.numero_factura + `</td>
                    <td>`+ (item.numero_quedan.length > 0 ? item.numero_quedan : "N/A") + `</td>
                    <td>`+ (item.no_cheque.length > 0 ? item.no_cheque : "N/A") + `</td>
                    <td>`+ fecha[0] + ` </td>
                    <td>`+ item.FacturasTipos.nombre + `</td>
                    <td>  `+ item.estado_pago + ` </td>
                    <td>`+ item.Sucursales.nombre + `</td>
                    <td>`+ item.detalle + `</td>
                    <td>`+ item.tipo_inventario + `</td>
                    <td align="right">`+ formatNumber(item.subtotal) + `</td>
                    <td align="right">`+ formatNumber(item.iva) + `</td>
                    <td align="right">`+ formatNumber(item.total) + `</td>
                    <td align="right">`+ formatNumber(item.iva_retenido) + `</td> 
                  </tr>
                `;
    }
    html += `
            </tbody>
          </table>
          <br/> 
        </td>
      </tr>
    </tbody>`;
  }
  if (datos.length == 0) {
    html += `<tbody>
<tr >
  <td colspan="6" class="text-center">
    <h4>Sin Datos</h4>
  </td>
</tr>
</tbody> `;
  }
  html += `

</table>
</body>
</html>
    `;

  return html;
}


export const htmlReporteChequesConsoli = async (datos: any) => {
  var html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte</title>
    <style>
    table,th,td {
      border: 0.2px solid black;
      border-collapse: collapse;
    }
    td { 
      font-size:10px; 
    }
    th { 
      font-size:12px;
      font-weight: bold; 
    }
    </style>
</head>
<body>
<h3 style="margin:0;">RESTAURANTE PASTARIA</h3>
<table  id="table_id" style="width:100%; ">
<thead>
  <tr> 
    <th scope="col" style="width: 2%">#</th>
    <th scope="col" style="width: 15%">Nombre del proveedor</th>
    <th scope="col" style="width: 20%">No. Cheque</th>
    <th scope="col" style="width: 10%">Monto total</th>
  </tr>
</thead>
<tbody   >
`;
  var total = 0;
  for (let index = 0; index < datos.length; index++) {
    const data = datos[index];
    total += data.monto;
    html += `
      <tr> 
         <td align="center">`+ (index + 1) + `</td>
        <td align="left">`+ data.proveedor + `</td>
        <td align="right"> </td> 
        <td align="right">`+ formatNumber(data.monto) + `</td>
      </tr> `;
  }
  if (datos.length == 0) {
    html += `
<tr >
  <td colspan="6" class="text-center">
    <h4>Sin Datos</h4>
  </td>
</tr>
`;
  }
  html += `
<tr>  
        <td align="right" colspan="3">Total </td> 
        <td align="right">`+ formatNumber(total) + `</td>
      </tr>
</tbody> 
</table>
</body>
</html>
    `;

  return html;
}


export const htmlImprimirCheque = async (datos: any) => {
  const ubicacionPlantilla = require.resolve(__dirname + "/../../html/reports/cierres_plantilla.html");
  let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf8');

  var fecha = new Date(datos[0].fecha_actualizacion).toLocaleString().split(",")[0];
  var nFecha = 60 - fecha.length - 2;
  var shoFecha = "";
  for (let index = 0; index < nFecha; index++) {
    shoFecha += "&nbsp;";
  }
  shoFecha = "&nbsp;&nbsp;" + fecha + shoFecha;

  var nProveedorName = 70 - datos[0].Proveedor.nombre.length;
  var shoProveedor = "";
  for (let index = 0; index < nProveedorName; index++) {
    shoProveedor += "&nbsp;";
  }
  shoProveedor = "&nbsp;&nbsp;" + datos[0].Proveedor.nombre + shoProveedor;


  var monto = 0.00;
  for (let index = 0; index < datos.length; index++) {
    const element = datos[index];
    monto += element.total;
  }

  var suma = numeroALetras(monto, {});
  var nSuma = 60 - suma.length;
  var shoSuma = "";
  for (let index = 0; index < nSuma; index++) {
    shoSuma += "&nbsp;";
  }
  shoSuma = "&nbsp;&nbsp;" + suma + shoSuma;
  var nmonto = 35 - (monto.toString()).length - 2;
  var shoMonto = "";
  for (let index = 0; index < nmonto; index++) {
    shoMonto += "&nbsp;";
  }
  shoMonto = "&nbsp;&nbsp;" + formatNumber(monto) + shoMonto;

  var html_facturas = "";
  for (let index = 0; index < datos.length; index++) {
    const element = datos[index];
    html_facturas += `C.C.F&nbsp;&nbsp;${element.numero_factura}&nbsp;&nbsp;&nbsp;&nbsp;$${formatNumber(element.total)}<br/>`;
  }
  html_facturas += `<hr/>${formatNumber(monto)}`;
  console.log(datos)
  contenidoHtml = contenidoHtml.replace("{{fecha_60}}", shoFecha);
  contenidoHtml = contenidoHtml.replace("{{no_comprobante}}", (datos[0].id_cheque).toString().padStart(6, '0'));
  contenidoHtml = contenidoHtml.replace("{{proveedor_name_145}}", shoProveedor);
  contenidoHtml = contenidoHtml.replace("{{suma_125}}", shoSuma);
  contenidoHtml = contenidoHtml.replace("{{monto_35}}", shoMonto);
  contenidoHtml = contenidoHtml.replace("{{listado_facturas}}", html_facturas);
  contenidoHtml = contenidoHtml.replace("{{cheque_}}", datos[0].no_cheque);
  return contenidoHtml;
}


