import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import expres from 'express';
import cors from 'cors';  

const app = expres();
app.use(cors());
app.use(expres.static('public')) ;
app.use(expres.json());

//listado de rutas
import usuarios from "./src/routes/usuarios";
import auth from "./src/routes/auth"; 
import catalogo_tipos from "./src/routes/facturacion/catalogo_tipos"; 
import catalogo_categorias from "./src/routes/facturacion/catalogo_categorias"; 
import catalogo from "./src/routes/facturacion/catalogo"; 
import factura from "./src/routes/facturacion/factura"; 
import reportes from "./src/routes/facturacion/reportes"; 
import cliente from "./src/routes/facturacion/cliente"; 
import bloques from "./src/routes/facturacion/bloques"; 
import decuentos from "./src/routes/facturacion/decuentos"; 
import sistema_data from "./src/routes/facturacion/sistema_data"; 

//intanciando rutas
app.use('/usuarios', usuarios );
app.use('/auth', auth);  

//reportes
app.use('/reportes/facturacion', reportes);  

//Facturacion
app.use('/facturacion/cliente', cliente);  
app.use('/facturacion/factura', factura);  
app.use('/facturacion/catalogo', catalogo);  
app.use('/facturacion/catalogo_tipos', catalogo_tipos);  
app.use('/facturacion/catalogo_categorias', catalogo_categorias);  
app.use('/facturacion/bloques', bloques);  
app.use('/facturacion/descuentos', decuentos);  
app.use('/facturacion/sistema_data', sistema_data);  

const port = process.env.PORT || 4000;
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo:',port)
});