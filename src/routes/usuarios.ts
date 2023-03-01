
import expres from 'express';
const router = expres.Router();
import { check } from "express-validator"; 
import { validarCampos } from '../middlewares/validar-campos'; 
import { validarJWT } from '../middlewares/validar-jwt'; 
import { actualizarUsuario, crearUsuario, eliminarUsuarios, getUsuarios,getUsuario } from '../controllers/usuarios';

 


router.get('/',validarJWT,getUsuarios);
router.get('/:id',validarJWT,getUsuario);
router.post('/',
    [
        validarJWT,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('nombres','El nombre es obligatorio').not().isEmpty(),
        check('apellidos','El apellido es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(), 
        check('id_rol','El id_rol es obligatorio').isNumeric(), 
        check('id_sucursal','El id_sucursal es obligatorio').isNumeric(), 
        validarCampos,
    ]
,crearUsuario);
router.put('/:id',
    [
        validarJWT,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('nombres','El nombre es obligatorio').not().isEmpty(),
        check('apellidos','El apellido es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(), 
        check('id_rol','El id_rol es obligatorio').isNumeric(), 
        check('id_sucursal','El id_sucursal es obligatorio').isNumeric(), 
        validarCampos,
    ]
,actualizarUsuario);

router.delete( '/:id' , validarJWT,eliminarUsuarios );

export default router;