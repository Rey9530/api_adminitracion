"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const factura_1 = require("../../controllers/facturacion/factura");
const validar_campos_1 = require("../../middlewares/validar-campos");
const validar_jwt_1 = require("../../middlewares/validar-jwt");
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("cliente", "El cliente es requerido").not().isEmpty(),
    (0, express_validator_1.check)("id_metodo_pago", "El metodo de pago es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("id_tipo_factura", "El tipo de factura es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("detalle_factura", "El tipo de factura es requerido").custom((e) => (0, validar_campos_1.validar_dato)(e, "is_array")),
    validar_campos_1.validarCampos,
], factura_1.crearFactura);
router.get("/obtener/:id", validar_jwt_1.validarJWT, factura_1.getNumeroFactura);
router.post("/buscar/catalogo", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("query", "El cliente es requerido").not().isEmpty(),
    validar_campos_1.validarCampos,
], factura_1.buscarEnCatalogo);
router.post("/buscar/clientes", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("query", "El cliente es requerido").not().isEmpty(),
    validar_campos_1.validarCampos,
], factura_1.buscarClientes);
router.get("/obtener_metodos_pago", validar_jwt_1.validarJWT, factura_1.obntenerMetodosDePago);
router.get("/obtener_listado_facturas", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("desde", "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    (0, express_validator_1.check)("hasta", "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    validar_campos_1.validarCampos,
], factura_1.obntenerListadoFacturas);
router.get("/obtener_departamentos", validar_jwt_1.validarJWT, factura_1.obntenerDepartamentos);
router.get("/obtener_municipios/:id", validar_jwt_1.validarJWT, factura_1.obntenerMunicipios);
router.get("/obtener_factura/:id", validar_jwt_1.validarJWT, factura_1.obntenerFactura);
router.delete("/anular_factura/:id", validar_jwt_1.validarJWT, factura_1.anularFactura);
exports.default = router;
