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
} from "../../controllers/facturacion/catalogo";
import fileUpload from "express-fileupload";
router.use(fileUpload());
router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check('id_tipo', 'El tipo es requerido').custom((e) => validar_dato(e, "positivo")),
    check('id_categoria', 'La categoria ers requerida').custom((e) => validar_dato(e, "positivo")),
    check("codigo", "El codigo es requerido").not().isEmpty(),
    check("nombre", "El nombre es requerido").not().isEmpty(),
    check('precio_con_iva', 'El precio con iva es requerido').custom((e) => validar_dato(e, "positivo_0")),
    check('precio_sin_iva', 'El precio sin iva es requerido').custom((e) => validar_dato(e, "positivo_0")),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check('id_tipo', 'El tipo es requerido').custom((e) => validar_dato(e, "positivo")),
    check('id_categoria', 'La categoria ers requerida').custom((e) => validar_dato(e, "positivo")),
    check("codigo", "El codigo es requerido").not().isEmpty(),
    check("nombre", "El nombre es requerido").not().isEmpty(),
    check('precio_con_iva', 'El precio con iva es requerido').custom((e) => validar_dato(e, "positivo_0")),
    check('precio_sin_iva', 'El precio sin iva es requerido').custom((e) => validar_dato(e, "positivo_0")),
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
