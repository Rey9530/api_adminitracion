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
  actualizarEstadoRegistro, 
} from "../../controllers/reservas/agenda";

router.get("/", validarJWT, getRegistros); 
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("id_sucursal", "La sucursal es obligatoria").not().isEmpty(),
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("no_personas", "El numero de personas es obligatorio")
      .not()
      .isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatoria").not().isEmpty(),
    check("start", "El hora es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id_sucursal", "La sucursal es obligatoria").not().isEmpty(),
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("no_personas", "El numero de personas es obligatorio")
      .not()
      .isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatoria").not().isEmpty(),
    check("start", "El hora es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarRegistro
);
router.put(
  "/cambiar_estado/:id",
  [
    validarJWT,
    check("estado", "El estado es obligatorio").not().isEmpty(), 
    validarCampos,
  ],
  actualizarEstadoRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
