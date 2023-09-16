import expres from "express";
const router = expres.Router();
// import { check } from "express-validator";
import {
  getProdctosByCategorys
} from "../../controllers/facturacion/punto_venta";
// import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";

router.get("/obtener_productos", validarJWT, getProdctosByCategorys);

export default router;
