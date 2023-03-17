"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reportes_1 = require("../../controllers/facturacion/reportes");
const validar_campos_1 = require("../../middlewares/validar-campos");
const validar_jwt_1 = require("../../middlewares/validar-jwt");
router.get("/consumidor_final", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("mes", "El tipo de factura es requerido").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    (0, express_validator_1.check)("anio", "El tipo de factura es requerido").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    validar_campos_1.validarCampos,
], reportes_1.getConsumidorFinal);
router.get("/credito_fiscal", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("desde", "El tipo de factura es requerido").isDate(),
    (0, express_validator_1.check)("hasta", "El tipo de factura es requerido").isDate(),
    validar_campos_1.validarCampos,
], reportes_1.getCreditoFiscal);
// router.get("/obtener_departamentos", validarJWT, obntenerDepartamentos);
// router.get("/obtener_municipios/:id", validarJWT, obntenerMunicipios);
// router.get("/obtener_factura/:id", validarJWT, obntenerFactura); 
exports.default = router;
