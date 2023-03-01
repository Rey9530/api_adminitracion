
import expres from 'express';
import { check } from "express-validator";  
import { login, loginRenew } from '../controllers/auth';
import { validarCampos } from '../middlewares/validar-campos'; 
import { validarJWT } from '../middlewares/validar-jwt'; 
 
const router = expres.Router();


router.post('/sign-in',[
    check('usuario','El usuario es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
] ,login ); 
router.post('/sign-in-with-token', validarJWT ,loginRenew ); 
export default router;