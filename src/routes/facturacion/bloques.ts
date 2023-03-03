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
  getTiposFactura,
} from "../../controllers/facturacion/bloques";

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("tira", "La tira es obligatoria").not().isEmpty(),
    check("desde", "El campo desde es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("hasta", "El campo hasta es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("actual", "El campo actual es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("serie", "El campo serie es obligatorio").not().isEmpty(),
    check('id_tipo_factura','El precio sin iva es requerido').custom( (e) => validar_dato(e,"positivo_0")),
    validarCampos,
  ],
  crearRegistro
); 
router.put(
  "/:id",
  [
    validarJWT,
    check("tira", "La tira es obligatoria").not().isEmpty(),
    check("desde", "El campo desde es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("hasta", "El campo hasta es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("actual", "El campo actual es obligatorio").custom( (e) => validar_dato(e,"positivo_0")),
    check("serie", "El campo serie es obligatorio").not().isEmpty(),
    check('id_tipo_factura','El precio sin iva es requerido').custom( (e) => validar_dato(e,"positivo_0")),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/factura/tipos", validarJWT, getTiposFactura);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
