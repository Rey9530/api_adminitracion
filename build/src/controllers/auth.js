"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRenew = exports.login = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const login = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, password } = req.body;
    try {
        const usaurioDB = yield prisma.usuarios.findFirst({
            where: {
                usuario,
            },
        });
        if (!usaurioDB) {
            return resp.status(400).json({
                status: false,
                msg: "El usuario o clave son incorrectos",
                data: null,
            });
        }
        const validarPass = bcryptjs_1.default.compareSync(password, usaurioDB.password);
        if (!validarPass) {
            return resp.status(400).json({
                status: false,
                msg: "El email o clave no existe",
            });
        }
        const token = yield (0, jwt_1.getenerarJWT)(usaurioDB.id, usaurioDB.id_sucursal);
        const dataGeneral = yield prisma.generalData.findFirst();
        dataGeneral.id_general = 0;
        resp.json({
            status: true,
            msg: "Logueado con exito",
            data: Object.assign(Object.assign(Object.assign({}, usaurioDB), { token }), dataGeneral),
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error revise logs",
        });
    }
    return;
});
exports.login = login;
const loginRenew = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.uid);
    const usaurioDB = yield prisma.usuarios.findFirst({
        where: {
            id: uid,
            estado: "ACTIVO",
        },
    });
    if (!usaurioDB) {
        resp.json({
            status: false,
            msg: "Error al renovar el Token ",
            data: null,
        });
    }
    const token = yield (0, jwt_1.getenerarJWT)(uid, usaurioDB === null || usaurioDB === void 0 ? void 0 : usaurioDB.id_sucursal);
    const dataGeneral = yield prisma.generalData.findFirst();
    dataGeneral.id_general = 0;
    resp.json({
        status: true,
        msg: "Token renovado",
        data: Object.assign(Object.assign(Object.assign({}, usaurioDB), { token }), dataGeneral),
    });
});
exports.loginRenew = loginRenew;
module.exports = {
    login: exports.login,
    loginRenew: exports.loginRenew,
};
