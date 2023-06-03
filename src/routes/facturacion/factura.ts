import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import {
  anularFactura,
  buscarClientes,
  buscarEnCatalogo,
  cargarCierre,
  cierreManual,
  crearFactura,
  getNumeroFactura,
  obntenerDepartamentos,
  obntenerFactura,
  obntenerListadoFacturas,
  obntenerMetodosDePago,
  obntenerMunicipios,
} from "../../controllers/facturacion/factura";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
import fileUpload from "express-fileupload";

router.use(fileUpload()); 
router.post(
  "/",
  [
    validarJWT,
    check("cliente", "El cliente es requerido").not().isEmpty(),
    check("id_metodo_pago", "El metodo de pago es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    check("id_tipo_factura", "El tipo de factura es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    check("detalle_factura", "El tipo de factura es requerido").custom((e) =>
      validar_dato(e, "is_array")
    ),
    validarCampos,
  ],
  crearFactura
);
router.post("/cierre_manual", validarJWT, cierreManual);
router.post("/cargar_cierre", validarJWT, cargarCierre);

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

router.post(
  "/buscar/clientes",
  [
    validarJWT,
    check("query", "El cliente es requerido").not().isEmpty(),
    validarCampos,
  ],
  buscarClientes
);

router.get("/obtener_metodos_pago", validarJWT, obntenerMetodosDePago);
router.get(
  "/obtener_listado_facturas",
  [
    validarJWT,
    check(
      "desde",
      "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd"
    )
      .not()
      .isEmpty()
      .isDate(),
    check(
      "hasta",
      "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd"
    )
      .not()
      .isEmpty()
      .isDate(),
    validarCampos,
  ],
  obntenerListadoFacturas
);
router.get("/obtener_departamentos", validarJWT, obntenerDepartamentos);
router.get("/obtener_municipios/:id", validarJWT, obntenerMunicipios);
router.get("/obtener_factura/:id", validarJWT, obntenerFactura);
router.delete("/anular_factura/:id", validarJWT, anularFactura);

export default router;
