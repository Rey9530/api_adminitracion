import { formatNumber } from "../format_number";

export const htmlReporteCheques = async (datos:any) => {
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
         <td align="center">`+(index + 1 )+`</td>
        <td align="center">`+data.proveedor+`</td>
        <td align="right">`+formatNumber(data.monto)+`</td>
        <td align="right">`+data.no_cuenta+`</td>
        <td align="right">`+data.banco+`</td>
        <td align="right">`+data.tipo_cuenta+`</td>
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
                    <td>`+(o + 1 )+`</td>
                    <td>`+item.numero_factura +`</td>
                    <td>`+(item.numero_quedan.length>0?item.numero_quedan:"N/A" )+`</td>
                    <td>`+(item.no_cheque.length>0?item.no_cheque:"N/A" )+`</td>
                    <td>`+fecha[0]+` </td>
                    <td>`+item.FacturasTipos.nombre+`</td>
                    <td>  `+item.estado_pago+` </td>
                    <td>`+item.Sucursales.nombre+`</td>
                    <td>`+item.detalle+`</td>
                    <td>`+item.tipo_inventario+`</td>
                    <td align="right">`+formatNumber(item.subtotal)  +`</td>
                    <td align="right">`+formatNumber(item.iva) +`</td>
                    <td align="right">`+formatNumber(item.total) +`</td>
                    <td align="right">`+formatNumber(item.iva_retenido) +`</td> 
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
if(datos.length==0){
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


