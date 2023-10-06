import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
import {
  cerrarCuenta,
  crearCuenta, crearorden, eliminaDetalleOrdenes, obtenerOrdenes,
} from "../../controllers/cuentas_clientes/cuentas_cliente";

router.get("/obtener_ordenes/:id_orden", validarCampos,obtenerOrdenes );
router.get("/cerrar_cuenta/:id_cuenta", validarCampos,cerrarCuenta );
router.delete("/eliminar_detalle/:id_orden", validarCampos,eliminaDetalleOrdenes );
router.post(
  "/",
  [
    validarJWT,
    check("id_mesa", "La mesa es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCuenta
);

router.put(
  "/agregar_orden/:id_orden",
  [
    validarJWT,
    check("detalle", "El detalle es requerido").custom((e) =>
      validar_dato(e, "is_array")
    ),
    validarCampos,
  ],
  crearorden
);

export default router;
