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
  getRegistrosBySucursal,
} from "../../controllers/admin/mesas";

router.get("/", validarJWT, getRegistros);
router.get("/get_by_sucursal/:id_sucursal/:ubicacion", validarJWT, getRegistrosBySucursal);
router.get("/:id", validarJWT, getRegistro);
router.post( 
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("n_personas", "El Número de Personas es obligatorio").not().isEmpty(),
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    check("ubicacion", "La sucursal es requerida y debe ser (PrimerPiso | SegundoPiso | Terraza) ").custom((e) =>
      validar_dato(e, "array", ["PrimerPiso", "SegundoPiso", "Terraza",])
    ),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("n_personas", "El Número de Personas es obligatorio").not().isEmpty(),
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    check("ubicacion", "La sucursal es requerida y debe ser (PrimerPiso | SegundoPiso | Terraza) ").custom((e) =>
      validar_dato(e, "array", ["PrimerPiso", "SegundoPiso", "Terraza",])
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
