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
  updateAsPrinicpal,
} from "../../controllers/inventario/bodegas";

router.get("/", validarJWT, getRegistros);
router.get("/:id", validarJWT, getRegistro);
router.get("/asignar_principal/:id", validarJWT, updateAsPrinicpal);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
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
    check("id_sucursal", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
