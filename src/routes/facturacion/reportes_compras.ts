import expres from "express";
const router = expres.Router();
import { check } from "express-validator"; 
import { validarCampos } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt"; 
import { libroCompras } from "../../controllers/facturacion/reportes_compras";
 
router.get(
  "/libro_compras",
  [
    validarJWT, 
    check("desde", "El tipo de factura es requerido").isDate(),
    check("hasta", "El tipo de factura es requerido").isDate(),
    validarCampos,
  ],
  libroCompras
); 
export default router;
