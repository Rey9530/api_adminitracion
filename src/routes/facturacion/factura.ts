import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { crearFactura } from "../../controllers/facturacion/factura";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";

router.post(
  "/",
  [
    validarJWT, 
    check("cliente", "El cliente es requerido").not().isEmpty(),
    check("id_tipo_factura", "El tipo de factura es requerido").custom((e) =>  validar_dato(e, "positivo") ),
    check("detalle_factura", "El tipo de factura es requerido").custom((e) =>  validar_dato(e, "is_array") ),
    validarCampos,
  ],
  crearFactura
);

export default router;
