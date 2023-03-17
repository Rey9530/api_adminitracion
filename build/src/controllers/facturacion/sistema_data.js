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
exports.updateDatosSistema = exports.getDatosSistema = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDatosSistema = (_ = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.generalData.findFirst();
        resp.json({
            status: true,
            msg: "Registros",
            data,
        });
    }
    catch (error) {
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.getDatosSistema = getDatosSistema;
const updateDatosSistema = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    try {
        let { nombre_sistema = 0, impuesto = 0, direccion = "", razon = "", nit = "", nrc = "", contactos = "", } = req.body;
        yield prisma.generalData.update({
            where: { id_general: uid },
            data: {
                nombre_sistema,
                impuesto,
                direccion,
                razon,
                nit,
                nrc,
                contactos,
            },
        });
        resp.json({
            status: true,
            msg: "Registro actualizado con exito",
        });
    }
    catch (error) {
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.updateDatosSistema = updateDatosSistema;
