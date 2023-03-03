import expres from "express";
const router = expres.Router(); 
import { getDatosSistema } from "../../controllers/facturacion/sistema_data"; 
import { validarJWT } from "../../middlewares/validar-jwt";


router.get("/", validarJWT, getDatosSistema); 
 

export default router;
