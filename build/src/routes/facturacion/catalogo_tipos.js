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
const catalogo_tipo_1 = require("../../controllers/facturacion/catalogo_tipo");
router.get("/", validar_jwt_1.validarJWT, catalogo_tipo_1.getRegistros);
router.get("/:id", validar_jwt_1.validarJWT, catalogo_tipo_1.getRegistro);
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").not().isEmpty(),
    validar_campos_1.validarCampos,
], catalogo_tipo_1.crearRegistro);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").not().isEmpty(),
    validar_campos_1.validarCampos,
], catalogo_tipo_1.actualizarRegistro);
router.delete("/:id", validar_jwt_1.validarJWT, catalogo_tipo_1.eliminarRegistro);
exports.default = router;
