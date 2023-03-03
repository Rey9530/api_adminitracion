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
import catalogo_tipos from "./src/routes/facturacion/catalogo_tipos"; 
import catalogo_categorias from "./src/routes/facturacion/catalogo_categorias"; 
import catalogo from "./src/routes/facturacion/catalogo"; 
// import factura from "./src/routes/facturacion/factura"; 

//intanciando rutas
app.use('/api/usuarios', usuarios );
app.use('/api/auth', auth);  

//Facturacion
// app.use('/api/facturacion/factura', factura);  
app.use('/api/facturacion/catalogo', catalogo);  
app.use('/api/facturacion/catalogo_tipos', catalogo_tipos);  
app.use('/api/facturacion/catalogo_categorias', catalogo_categorias);  

const port = process.env.PORT || 4000;
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo:',port)
});  