import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
import {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
} from "../../controllers/facturacion/cliente";
import fileUpload from "express-fileupload";

router.use(fileUpload()); 
router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('telefono','El nombre es requerido').not().isEmpty(),
    check('direccion','El nombre es requerido').not().isEmpty(),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('telefono','El nombre es requerido').not().isEmpty(),
    check('direccion','El nombre es requerido').not().isEmpty(), 
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
