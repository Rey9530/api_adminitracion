
import expres from 'express';
const router = expres.Router();
// import { check } from "express-validator"; 
// import { validarCampos } from '../middlewares/validar-campos'; 
// import { validarJWT } from '../middlewares/validar-jwt'; 
import { getData, getHtml, getPdf, } from '../controllers/utils_';

 


router.get('/',getData); 
router.get('/ver_pdf',getPdf); 
router.get('/ver_html',getHtml); 

export default router;