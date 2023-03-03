import expres from "express";
import { check } from "express-validator";
const router = expres.Router(); 
import { getDatosSistema, updateDatosSistema } from "../../controllers/facturacion/sistema_data"; 
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";


router.get("/", validarJWT, getDatosSistema);  

router.put(
    "/:id",
    [
      validarJWT,  
      check("nombre_sistema", "El nombre es requerido").not().isEmpty(),  
      check('impuesto','El impuesto es requerido').custom( (e) => validar_dato(e,"positivo_decimal")),
      validarCampos,
    ],
    updateDatosSistema
  );
 

export default router;
