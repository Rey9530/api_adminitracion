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
exports.eliminarRegistro = exports.actualizarRegistro = exports.crearRegistro = exports.getRegistro = exports.getRegistros = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRegistros = (req, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { pagina = 1, registrosXpagina = 10, query = "" } = req.query;
    pagina = Number(pagina);
    registrosXpagina = Number(registrosXpagina);
    pagina = pagina > 0 ? pagina : 0;
    registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;
    let consultas = [];
    if (query.length > 3) {
        let array = query.split(" ");
        consultas = array.map((contains) => {
            return {
                AND: [
                    {
                        OR: [
                            { codigo: { contains } },
                            { nombre: { contains } },
                            { descripcion: { contains } },
                        ],
                    },
                ],
            };
        });
    }
    const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
    const total = yield prisma.catalogo.count({ where });
    const registros = yield prisma.catalogo.findMany({
        where,
        include: { Tipo: true, Categorias: true },
        take: registrosXpagina,
        skip: (pagina - 1) * registrosXpagina,
    });
    const totalFiltrado = yield registros.length;
    resp.json({
        status: true,
        msg: "Listado de registros",
        total,
        totalFiltrado,
        pagina,
        registrosXpagina,
        registros,
    });
});
exports.getRegistros = getRegistros;
const getRegistro = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    const registros = yield prisma.catalogo.findFirst({
        where: { id_catalogo: uid, estado: "ACTIVO" },
        include: { Tipo: true, Categorias: true },
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
    let { id_tipo = 0, id_categoria = 0, codigo = "0000", nombre = "", descripcion = "", precio_con_iva = 0, precio_sin_iva = 0, } = req.body;
    try {
        const [tipo, categoria] = yield Promise.all([
            yield prisma.catalogoTipo.findFirst({
                where: { id_tipo },
            }),
            yield prisma.catalogoCategorias.findFirst({
                where: { id_categoria },
            }),
        ]);
        if (!tipo) {
            return resp.status(400).json({
                status: false,
                msg: "El tipo no existe ",
            });
        }
        if (!categoria) {
            return resp.status(400).json({
                status: false,
                msg: "La categoria no existe",
            });
        }
        const data = yield prisma.catalogo.create({
            data: {
                id_tipo,
                id_categoria,
                codigo,
                nombre,
                descripcion,
                precio_con_iva,
                precio_sin_iva,
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
    let uid = Number(req.params.id);
    try {
        const registro = yield prisma.catalogo.findFirst({
            where: { id_catalogo: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        let { id_tipo = 0, id_categoria = 0, codigo = "0000", nombre = "", descripcion = "", precio_con_iva = 0, precio_sin_iva = 0, } = req.body;
        const [tipo, categoria] = yield Promise.all([
            yield prisma.catalogoTipo.findFirst({
                where: { id_tipo },
            }),
            yield prisma.catalogoCategorias.findFirst({
                where: { id_categoria },
            }),
        ]);
        if (!tipo) {
            return resp.status(400).json({
                status: false,
                msg: "El tipo no existe ",
            });
        }
        if (!categoria) {
            return resp.status(400).json({
                status: false,
                msg: "La categoria no existe",
            });
        }
        const registroActualizado = yield prisma.catalogo.update({
            where: { id_catalogo: uid },
            data: {
                id_tipo,
                id_categoria,
                codigo,
                nombre,
                descripcion,
                precio_con_iva,
                precio_sin_iva,
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
        const registro = yield prisma.catalogo.findFirst({
            where: { id_catalogo: uid, estado: "ACTIVO" },
        });
        if (!registro) {
            return resp.status(400).json({
                status: false,
                msg: "El registro no existe",
            });
        }
        yield prisma.catalogo.update({
            data: { estado: "INACTIVO" },
            where: { id_catalogo: uid },
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
