"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = express_1.default.Router();
router.post('/sign-in', [
    (0, express_validator_1.check)('usuario', 'El usuario es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos
], auth_1.login);
router.post('/sign-in-with-token', validar_jwt_1.validarJWT, auth_1.loginRenew);
exports.default = router;
