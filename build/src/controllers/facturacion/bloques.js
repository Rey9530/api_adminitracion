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
exports.getTiposFactura = exports.eliminarRegistro = exports.actualizarRegistro = exports.crearRegistro = exports.getRegistro = exports.getRegistros = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRegistros = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    const registros = yield prisma.facturasBloques.findMany({
        where: { estado: "ACTIVO", id_sucursal },
        include: { Tipo: true },
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
const getRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    const registros = yield prisma.facturasBloques.findFirst({
        where: { id_bloque: uid, estado: "ACTIVO", id_sucursal },
        include: { Tipo: true },
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
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    let { autorizacion = "", tira = "", desde = 0, hasta = 0, actual = 0, serie = "", id_tipo_factura = 0, } = req.body;
    try {
        if (actual < desde || actual > hasta) {
            return resp.json({
                status: false,
                msg: "El actual esta fuera de rango de los campos DESDE y HASTA",
                data: null,
            });
        }
        const data = yield prisma.facturasBloques.create({
            data: {
                autorizacion,
                tira,
                desde,
                hasta,
                actual,
                serie,
                id_tipo_factura,
                id_sucursal,
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
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    try {
        const registro = yield prisma.facturasBloques.findFirst({
            where: { id_bloque: uid, estado: "ACTIVO", id_sucursal },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        let { autorizacion = "", tira = "", desde = 0, hasta = 0, actual = 0, serie = "", id_tipo_factura = 0, } = req.body;
        if (actual < desde || actual > hasta) {
            return resp.json({
                status: false,
                msg: "El actual esta fuera de rango de los campos DESDE y HASTA",
                data: null,
            });
        }
        const registroActualizado = yield prisma.facturasBloques.update({
            where: { id_bloque: uid },
            data: {
                autorizacion,
                tira,
                desde,
                hasta,
                actual,
                serie,
                id_tipo_factura,
                id_sucursal,
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
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    try {
        const registro = yield prisma.facturasBloques.findFirst({
            where: { id_bloque: uid, estado: "ACTIVO", id_sucursal },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        yield prisma.facturasBloques.update({
            data: { estado: "INACTIVO" },
            where: { id_bloque: uid },
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
const getTiposFactura = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    try {
        const data = yield prisma.facturasTipos.findMany({
            where: { estado: "ACTIVO" },
            include: { Bloques: { where: { estado: "ACTIVO", id_sucursal } } },
        });
        resp.json({
            status: true,
            msg: "Listado de registros",
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
exports.getTiposFactura = getTiposFactura;
