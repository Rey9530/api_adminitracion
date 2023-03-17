"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const { request, response } = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req = request, resp = response, next) => {
    const token = req.header('accessToken');
    if (!token) {
        return resp.status(401).json({
            status: false,
            msg: 'No se detecta el accessToken'
        });
    }
    try {
        const { uid, ids } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "1234");
        req.params.uid = uid;
        req.params.ids = ids;
        next();
    }
    catch (error) {
        return resp.status(401).json({
            status: false,
            msg: 'No se detecta el accessToken'
        });
    }
};
exports.validarJWT = validarJWT;
