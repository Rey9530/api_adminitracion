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
  getLiquidaciones,
  getNumeroFactura,
  liquidacion,
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
router.get("/liquidaciones/:id_sucursal", validarJWT, getLiquidaciones);
router.post("/cierre_manual", validarJWT, cierreManual);
router.post("/liquidacion",
  [
    validarJWT,
    check("no_corr", "El no_corr es requerido").not().isEmpty(),
    check("fecha", "El fecha es requerido").not().isEmpty(),
    check("no_compra", "El no_compra es requerido").not().isEmpty(),
    check("no_registro", "El no_registro es requerido").not().isEmpty(),
    check("hora_inicio", "El hora_inicio es requerido").not().isEmpty(),
    check("hora_fin", "El hora_fin es requerido").not().isEmpty(),
    check("proveedor", "El proveedor es requerido").not().isEmpty(),
    check("concepto", "El concepto es requerido").not().isEmpty(),
    check("valor", "El valor es requerido").not().isEmpty(),
    check("responsable", "El responsable es requerido").not().isEmpty(),
    check("id_sucursal", "El id_sucursal es requerido").not().isEmpty(),
    validarCampos,
  ],
  liquidacion
);
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
