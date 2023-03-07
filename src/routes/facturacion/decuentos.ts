import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
import {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getTiposDescuentos,
  getRegistrosActivos,
} from "../../controllers/facturacion/decuentos";

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El campo serie es obligatorio").not().isEmpty(),
    check("porcentaje", "El campo desde es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El campo serie es obligatorio").not().isEmpty(),
    check("porcentaje", "El campo desde es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/listar/tipos", validarJWT, getTiposDescuentos);
router.get("/listar/activos", validarJWT, getRegistrosActivos);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
