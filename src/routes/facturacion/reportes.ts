import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { getConsumidorFinal, getCreditoFiscal } from "../../controllers/facturacion/reportes";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt"; 
router.get(
  "/consumidor_final",
  [
    validarJWT, 
    check("mes", "El tipo de factura es requerido").custom((e) => validar_dato(e, "positivo") ),
    check("anio", "El tipo de factura es requerido").custom((e) => validar_dato(e, "positivo") ),
    validarCampos,
  ],
  getConsumidorFinal
);
router.get(
  "/credito_fiscal",
  [
    validarJWT, 
    check("desde", "El tipo de factura es requerido").isDate(),
    check("hasta", "El tipo de factura es requerido").isDate(),
    validarCampos,
  ],
  getCreditoFiscal
); 
export default router;
