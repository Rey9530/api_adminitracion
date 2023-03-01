import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import expres from 'express';
import cors from 'cors';  

const app = expres();
app.use(cors())
app.use(expres.static('public'))
app.use(expres.json());

//listado de rutas
import usuarios from "./src/routes/usuarios";
import auth from "./src/routes/auth";
// import uploads from "./routes/uploads";
// import sucursales from "./routes/crud/sucursales";
// import roles from "./routes/crud/roles";
// import bodegas from "./routes/crud/bodegas";
// import marcas_autos from "./routes/crud/marcas_autos";
// import modelos_autos from "./routes/crud/modelos_autos";
// import categorias from "./routes/crud/categorias";
// import tipos_servicios from "./routes/crud/tipos_servicios";
// import servicios from "./routes/crud/servicios";
// import espacios_taller from "./routes/crud/espacios_taller";
// import proveedores from "./routes/crud/proveedores";
// import proveedores_contactos from "./routes/crud/proveedores_contactos";
// import clientes from "./routes/crud/clientes";
// import tipos_autos from "./routes/crud/tipos_autos";
// import prechequeos from "./routes/crud/prechequeos";
// import autos from "./routes/crud/autos";
// import inventario from "./routes/inventario";
// import cotizaciones from "./routes/cotizaciones";

//intanciando rutas
app.use('/api/usuarios', usuarios );
app.use('/api/auth', auth); 
// app.use('/api/uploads', uploads);
// app.use('/api/sucursales', sucursales);
// app.use('/api/roles', roles);
// app.use('/api/bodegas', bodegas); 
// app.use('/api/marcas_autos', marcas_autos);  
// app.use('/api/modelos_autos', modelos_autos);
// app.use('/api/categorias', categorias);  
// app.use('/api/tipos_servicios', tipos_servicios); 
// app.use('/api/servicios', servicios); 
// app.use('/api/espacios_taller', espacios_taller); 
// app.use('/api/proveedores', proveedores); 
// app.use('/api/proveedores_contactos', proveedores_contactos); 
// app.use('/api/clientes', clientes);  
// app.use('/api/tipos_autos', tipos_autos); 
// app.use('/api/prechequeos', prechequeos); 
// app.use('/api/autos', autos);
// app.use('/api/inventario', inventario);
// app.use('/api/cotizaciones', cotizaciones);

const port = process.env.PORT || 4000;
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo:',port)
});  