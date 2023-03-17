"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../../middlewares/validar-campos");
const validar_jwt_1 = require("../../middlewares/validar-jwt");
const catalogo_1 = require("../../controllers/facturacion/catalogo");
router.get("/", validar_jwt_1.validarJWT, catalogo_1.getRegistros);
router.get("/:id", validar_jwt_1.validarJWT, catalogo_1.getRegistro);
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id_tipo', 'El tipo es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    (0, express_validator_1.check)('id_categoria', 'La categoria ers requerida').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    (0, express_validator_1.check)("codigo", "El codigo es requerido").not().isEmpty(),
    (0, express_validator_1.check)("nombre", "El nombre es requerido").not().isEmpty(),
    (0, express_validator_1.check)('precio_con_iva', 'El precio con iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)('precio_sin_iva', 'El precio sin iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], catalogo_1.crearRegistro);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id_tipo', 'El tipo es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    (0, express_validator_1.check)('id_categoria', 'La categoria ers requerida').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo")),
    (0, express_validator_1.check)("codigo", "El codigo es requerido").not().isEmpty(),
    (0, express_validator_1.check)("nombre", "El nombre es requerido").not().isEmpty(),
    (0, express_validator_1.check)('precio_con_iva', 'El precio con iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)('precio_sin_iva', 'El precio sin iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], catalogo_1.actualizarRegistro);
router.delete("/:id", validar_jwt_1.validarJWT, catalogo_1.eliminarRegistro);
exports.default = router;
