"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validar_dato = exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
const validarCampos = (req, resp, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({
            status: true,
            msg: "Error de parametros",
            errors: errors.mapped(),
        });
    }
    next();
    return;
};
exports.validarCampos = validarCampos;
const validar_dato = (valor, tipo) => {
    if (valor === undefined || valor === null) {
        return false;
    }
    if (tipo == "positivo") {
        return parseInt(valor) > 0 ? true : false;
    }
    if (tipo == "positivo_0") {
        return parseInt(valor) >= 0 ? true : false;
    }
    if (tipo == "positivo_decimal") {
        return parseFloat(valor) > 0 ? true : false;
    }
    if (tipo == "is_array") {
        return Array.isArray(valor) && valor.length > 0 ? true : false;
    }
    return true;
};
exports.validar_dato = validar_dato;
