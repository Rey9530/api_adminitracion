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
const bloques_1 = require("../../controllers/facturacion/bloques");
router.get("/", validar_jwt_1.validarJWT, bloques_1.getRegistros);
router.get("/:id", validar_jwt_1.validarJWT, bloques_1.getRegistro);
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("autorizacion", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("tira", "La tira es obligatoria").not().isEmpty(),
    (0, express_validator_1.check)("serie", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("desde", "El campo desde es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("hasta", "El campo hasta es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("actual", "El campo actual es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)('id_tipo_factura', 'El precio sin iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], bloques_1.crearRegistro);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("autorizacion", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("tira", "La tira es obligatoria").not().isEmpty(),
    (0, express_validator_1.check)("serie", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("desde", "El campo desde es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("hasta", "El campo hasta es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)("actual", "El campo actual es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    (0, express_validator_1.check)('id_tipo_factura', 'El precio sin iva es requerido').custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], bloques_1.actualizarRegistro);
router.get("/factura/tipos", validar_jwt_1.validarJWT, bloques_1.getTiposFactura);
router.delete("/:id", validar_jwt_1.validarJWT, bloques_1.eliminarRegistro);
exports.default = router;
