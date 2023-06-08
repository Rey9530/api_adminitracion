
import expres from 'express';
const router = expres.Router();
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';
import { actualizarClaveUsuario, actualizarUsuario, getUsuario } from '../controllers/perfil';


router.get('/', validarJWT, getUsuario);
router.put('/',
    [
        validarJWT, 
        check('nombres', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(), 
        validarCampos,
    ]
    , actualizarUsuario);
router.put('/actualizar_clave/',
    [
        validarJWT, 
        check('clave_actual', 'El nombre es obligatorio').not().isEmpty(),
        check('clave_nueva', 'El nombre es obligatorio').not().isEmpty(),
        check('clave_confirmada', 'El apellido es obligatorio').not().isEmpty(), 
        validarCampos,
    ]
    , actualizarClaveUsuario);


export default router;