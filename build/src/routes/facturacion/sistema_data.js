"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const sistema_data_1 = require("../../controllers/facturacion/sistema_data");
const validar_campos_1 = require("../../middlewares/validar-campos");
const validar_jwt_1 = require("../../middlewares/validar-jwt");
router.get("/", validar_jwt_1.validarJWT, sistema_data_1.getDatosSistema);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("nombre_sistema", "El nombre es requerido").not().isEmpty(),
    (0, express_validator_1.check)('impuesto', 'El impuesto es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_decimal")),
    validar_campos_1.validarCampos,
], sistema_data_1.updateDatosSistema);
exports.default = router;
