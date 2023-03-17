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
const decuentos_1 = require("../../controllers/facturacion/decuentos");
router.get("/", validar_jwt_1.validarJWT, decuentos_1.getRegistros);
router.get("/:id", validar_jwt_1.validarJWT, decuentos_1.getRegistro);
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("nombre", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("porcentaje", "El campo desde es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], decuentos_1.crearRegistro);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("nombre", "El campo serie es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("porcentaje", "El campo desde es obligatorio").custom((e) => (0, validar_campos_1.validar_dato)(e, "positivo_0")),
    validar_campos_1.validarCampos,
], decuentos_1.actualizarRegistro);
router.get("/listar/tipos", validar_jwt_1.validarJWT, decuentos_1.getTiposDescuentos);
router.get("/listar/activos", validar_jwt_1.validarJWT, decuentos_1.getRegistrosActivos);
router.delete("/:id", validar_jwt_1.validarJWT, decuentos_1.eliminarRegistro);
exports.default = router;
