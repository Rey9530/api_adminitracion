import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import {
  buscarEnCatalogo,
  crearFactura,
  getNumeroFactura,
  obntenerDepartamentos,
  obntenerMetodosDePago,
  obntenerMunicipios,
} from "../../controllers/facturacion/factura";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";

router.post(
  "/",
  [
    validarJWT,
    check("cliente", "El cliente es requerido").not().isEmpty(), 
    check("id_metodo_pago", "El metodo de pago es obligatorio").custom((e) => validar_dato(e, "positivo_0") ),
    check("id_tipo_factura", "El tipo de factura es obligatorio").custom((e) => validar_dato(e, "positivo_0") ),
    check("detalle_factura", "El tipo de factura es requerido").custom((e) =>
      validar_dato(e, "is_array")
    ),
    validarCampos,
  ],
  crearFactura
);

// efectivo
// tarjeta
// cheque
// transferencia
// credito
// id_metodo_pago

router.get("/obtener/:id", validarJWT, getNumeroFactura);

router.post(
  "/buscar/catalogo",
  [
    validarJWT,
    check("query", "El cliente es requerido").not().isEmpty(),
    validarCampos,
  ],
  buscarEnCatalogo
);

router.get("/obtener_metodos_pago", validarJWT, obntenerMetodosDePago);
router.get("/obtener_departamentos", validarJWT, obntenerDepartamentos);
router.get("/obtener_municipios/:id", validarJWT, obntenerMunicipios);

export default router;
