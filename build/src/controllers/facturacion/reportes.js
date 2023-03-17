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
exports.getCreditoFiscal = exports.getConsumidorFinal = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getConsumidorFinal = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { mes = 0, anio = 0 } = req.query;
    mes = mes > 0 ? mes : 0;
    let diasMes = new Date(anio, mes, 0);
    mes = mes > 0 ? mes - 1 : 0;
    diasMes = diasMes.getDate();
    var arrayDatos = [];
    // for (let index = 14; index <= 15; index++) {
    let totales = {};
    totales.ventas_exentas = 0;
    totales.ventas_no_sujetas = 0;
    totales.ventas_locales = 0;
    totales.ventas_exportacion = 0;
    totales.ventas_totales = 0;
    totales.ventas_terceros = 0;
    for (let index = 1; index <= diasMes; index++) {
        var fecha = new Date(anio, mes, index);
        var desde = new Date(anio, mes, index, 0, 0, 0);
        var hasta = new Date(anio, mes, index, 23, 59, 59);
        var fecha_creacio = {
            fecha_creacion: {
                gte: desde,
                lte: hasta,
            },
        };
        const [facturaInit, facturaEnd, facturas] = yield Promise.all([
            yield prisma.facturas.findFirst({
                where: Object.assign(Object.assign({}, fecha_creacio), { Bloque: { Tipo: { id_tipo_factura: 1 } } }),
            }),
            yield prisma.facturas.findFirst({
                where: Object.assign(Object.assign({}, fecha_creacio), { Bloque: { Tipo: { id_tipo_factura: 1 } } }),
                orderBy: {
                    id_factura: "desc",
                },
            }),
            yield prisma.facturas.findMany({
                where: Object.assign(Object.assign({}, fecha_creacio), { Bloque: { Tipo: { id_tipo_factura: 1 } } }),
            }),
        ]);
        var ventas_locales = 0;
        facturas.forEach((item) => {
            var _a;
            ventas_locales += (_a = item.total) !== null && _a !== void 0 ? _a : 0;
        });
        totales.ventas_locales += ventas_locales;
        totales.ventas_totales += ventas_locales;
        var fila = {
            index,
            fecha,
            desde: (_a = facturaInit === null || facturaInit === void 0 ? void 0 : facturaInit.numero_factura) !== null && _a !== void 0 ? _a : 0,
            hasta: (_b = facturaEnd === null || facturaEnd === void 0 ? void 0 : facturaEnd.numero_factura) !== null && _b !== void 0 ? _b : 0,
            maquina: "-",
            ventas_exentas: 0,
            ventas_no_sujetas: 0,
            ventas_locales,
            ventas_exportacion: 0,
            ventas_totales: ventas_locales,
            ventas_terceros: 0,
        };
        arrayDatos.push(fila);
    }
    resp.json({
        status: true,
        msg: "Listado de registros",
        data: arrayDatos,
        totales,
    });
});
exports.getConsumidorFinal = getConsumidorFinal;
const getCreditoFiscal = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    var desde1 = req.query.desde.toString().split("-");
    var hasta1 = req.query.hasta.toString().split("-");
    var desde = new Date(desde1[0], (desde1[1] - 1), desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], (hasta1[1] - 1), hasta1[2], 23, 59, 59);
    var totales = [];
    var data = yield prisma.facturas.findMany({
        where: {
            fecha_creacion: {
                gte: desde,
                lte: hasta,
            },
            Bloque: { Tipo: { id_tipo_factura: 2 } },
        },
    });
    resp.json({
        status: true,
        msg: "Listado de registros",
        data,
        totales,
    });
});
exports.getCreditoFiscal = getCreditoFiscal;
