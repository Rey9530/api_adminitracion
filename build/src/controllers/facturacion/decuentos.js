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
exports.getTiposDescuentos = exports.eliminarRegistro = exports.actualizarRegistro = exports.crearRegistro = exports.getRegistro = exports.getRegistrosActivos = exports.getRegistros = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRegistros = (__, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const registros = yield prisma.facturasDescuentos.findMany({
        where: { estado: "ACTIVO" },
    });
    const total = yield registros.length;
    resp.json({
        status: true,
        msg: "Listado de registros",
        registros,
        total,
    });
});
exports.getRegistros = getRegistros;
const getRegistrosActivos = (__, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.facturasDescuentos.findMany({
        where: {
            estado: "ACTIVO",
            OR: [{ isItem: "AMBOS" }, { isItem: "GLOBAL" }, { isItem: "ITEM" }],
        },
    });
    const total = yield data.length;
    resp.json({
        status: true,
        msg: "Listado de registros",
        data,
        total,
    });
});
exports.getRegistrosActivos = getRegistrosActivos;
const getRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    const registros = yield prisma.facturasDescuentos.findFirst({
        where: { id_descuento: uid, estado: "ACTIVO" },
    });
    if (!registros) {
        resp.status(400).json({
            status: false,
            msg: "El registro no existe",
        });
    }
    else {
        resp.json({
            status: true,
            msg: "Exito",
            registros,
        });
    }
});
exports.getRegistro = getRegistro;
const crearRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre = "", porcentaje = 0, isItem = "AMBOS" } = req.body;
    try {
        const data = yield prisma.facturasDescuentos.create({
            data: {
                nombre,
                porcentaje,
                isItem,
            },
        });
        resp.json({
            status: true,
            msg: "Registro creado con Éxito",
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
exports.crearRegistro = crearRegistro;
const actualizarRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    // validar que el actual no sea mayor que el +hasta+ o menor que el +desde+
    let uid = Number(req.params.id);
    try {
        const registro = yield prisma.facturasDescuentos.findFirst({
            where: { id_descuento: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        let { nombre = "", porcentaje = 0, isItem = "AMBOS" } = req.body;
        const registroActualizado = yield prisma.facturasDescuentos.update({
            where: { id_descuento: uid },
            data: {
                nombre,
                porcentaje,
                isItem,
            },
        });
        resp.json({
            status: true,
            msg: "Registro Actualizado",
            data: registroActualizado,
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.actualizarRegistro = actualizarRegistro;
const eliminarRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    try {
        const registro = yield prisma.facturasDescuentos.findFirst({
            where: { id_descuento: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        yield prisma.facturasDescuentos.update({
            data: { estado: "INACTIVO" },
            where: { id_descuento: uid },
        });
        resp.json({
            status: true,
            msg: "Registro elimiando",
        });
    }
    catch (error) {
        console.log(error);
        resp.status(500).json({
            status: false,
            msg: "Error inesperado reviosar log",
        });
    }
    return;
});
exports.eliminarRegistro = eliminarRegistro;
const getTiposDescuentos = (_ = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        resp.json({
            status: true,
            msg: "Success",
            data: ["ITEM", "GLOBAL", "AMBOS", "INACTIVO"],
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
exports.getTiposDescuentos = getTiposDescuentos;
