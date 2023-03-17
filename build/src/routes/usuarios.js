"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const usuarios_1 = require("../controllers/usuarios");
router.get('/', validar_jwt_1.validarJWT, usuarios_1.getUsuarios);
router.get('/:id', validar_jwt_1.validarJWT, usuarios_1.getUsuario);
router.post('/', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('nombres', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('id_rol', 'El id_rol es obligatorio').isNumeric(),
    (0, express_validator_1.check)('id_sucursal', 'El id_sucursal es obligatorio').isNumeric(),
    validar_campos_1.validarCampos,
], usuarios_1.crearUsuario);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('nombres', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('id_rol', 'El id_rol es obligatorio').isNumeric(),
    (0, express_validator_1.check)('id_sucursal', 'El id_sucursal es obligatorio').isNumeric(),
    validar_campos_1.validarCampos,
], usuarios_1.actualizarUsuario);
router.delete('/:id', validar_jwt_1.validarJWT, usuarios_1.eliminarUsuarios);
exports.default = router;
