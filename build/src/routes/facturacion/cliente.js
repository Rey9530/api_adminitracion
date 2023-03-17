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
const cliente_1 = require("../../controllers/facturacion/cliente");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
router.use((0, express_fileupload_1.default)());
router.get("/", validar_jwt_1.validarJWT, cliente_1.getRegistros);
router.get("/:id", validar_jwt_1.validarJWT, cliente_1.getRegistro);
router.get("/facturas/:id", validar_jwt_1.validarJWT, cliente_1.getFacturas);
router.post("/", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('nombre', 'El nombre es requerido').not().isEmpty(),
    (0, express_validator_1.check)('telefono', 'El nombre es requerido').not().isEmpty(),
    (0, express_validator_1.check)('direccion', 'El nombre es requerido').not().isEmpty(),
    validar_campos_1.validarCampos,
], cliente_1.crearRegistro);
router.put("/:id", [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('nombre', 'El nombre es requerido').not().isEmpty(),
    (0, express_validator_1.check)('telefono', 'El nombre es requerido').not().isEmpty(),
    (0, express_validator_1.check)('direccion', 'El nombre es requerido').not().isEmpty(),
    validar_campos_1.validarCampos,
], cliente_1.actualizarRegistro);
router.delete("/:id", validar_jwt_1.validarJWT, cliente_1.eliminarRegistro);
exports.default = router;
