
import expres from 'express';
const router = expres.Router();
// import { check } from "express-validator"; 
// import { validarCampos } from '../middlewares/validar-campos'; 
// import { validarJWT } from '../middlewares/validar-jwt'; 
import { getData, } from '../controllers/utils_';

 


router.get('/',getData); 

export default router;