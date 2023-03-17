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
exports.eliminarUsuarios = exports.actualizarUsuario = exports.crearUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsuarios = (__, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield prisma.usuarios.findMany({
        where: { estado: "ACTIVO" },
    });
    const total = yield usuarios.length;
    resp.json({
        status: true,
        msg: "Usuario",
        usuarios,
        total,
    });
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    const usuario = yield prisma.usuarios.findFirst({
        where: { id: uid, estado: "ACTIVO" },
    });
    if (!usuario) {
        resp.status(400).json({
            status: false,
            msg: "El usuario no existe o esta deshabilitado",
        });
    }
    else {
        resp.json({
            status: true,
            msg: "Usuario",
            usuario,
        });
    }
});
exports.getUsuario = getUsuario;
const crearUsuario = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal } = req.body;
    try {
        const existeRol = yield prisma.roles.findUnique({ where: { id_rol } });
        if (!existeRol) {
            return resp.status(400).json({
                status: false,
                msg: "El registro del rol no existe",
            });
        }
        const existeSucursal = yield prisma.sucursales.findUnique({
            where: { id_sucursal },
        });
        if (!existeSucursal) {
            return resp.status(400).json({
                status: false,
                msg: "El registro de la sucursal no existe",
            });
        }
        const existeEmail = yield prisma.usuarios.findFirst({
            where: {
                usuario
            },
        });
        if (existeEmail) {
            return resp.status(400).json({
                status: true,
                msg: usuario + " ya existe",
            });
        }
        //encriptar clave
        const salt = bcryptjs_1.default.genSaltSync();
        password = bcryptjs_1.default.hashSync(password, salt);
        const userSaved = yield prisma.usuarios.create({
            data: {
                usuario,
                password,
                nombres,
                apellidos,
                dui,
                id_rol,
                id_sucursal,
            },
        });
        const token = yield (0, jwt_1.getenerarJWT)(userSaved.id);
        resp.json({
            status: true,
            msg: "Crear usuario",
            data: Object.assign(Object.assign({}, userSaved), { token }),
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
exports.crearUsuario = crearUsuario;
const actualizarUsuario = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    try {
        const existeEmail = yield prisma.usuarios.findFirst({
            where: { id: uid, estado: "ACTIVO" },
        });
        if (!existeEmail) {
            return resp.status(400).json({
                status: false,
                msg: "El usuario no existe o esta deshabilitado",
            });
        }
        const { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal } = req.body;
        if (existeEmail.usuario != usuario) {
            const existeEmail = yield prisma.usuarios.findFirst({
                where: { usuario },
            });
            if (existeEmail) {
                return resp.status(400).json({
                    status: true,
                    msg: "Ya existe un registro con ese usuario",
                });
            }
        }
        const existeRol = yield prisma.roles.findUnique({ where: { id_rol } });
        if (!existeRol) {
            return resp.status(400).json({
                status: false,
                msg: "El registro del rol no existe",
            });
        }
        const existeSucursal = yield prisma.sucursales.findUnique({
            where: { id_sucursal },
        });
        if (!existeSucursal) {
            return resp.status(400).json({
                status: false,
                msg: "El registro de la sucursal no existe",
            });
        }
        const usuarioUpdate = yield prisma.usuarios.update({
            where: { id: uid },
            data: { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal },
        });
        resp.json({
            status: true,
            msg: "Usuario Actualizado",
            usuario: usuarioUpdate,
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
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuarios = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = Number(req.params.id);
    try {
        const existeEmail = yield prisma.usuarios.findFirst({
            where: { id: uid, estado: "ACTIVO" },
        });
        if (!existeEmail) {
            return resp.status(400).json({
                status: false,
                msg: "El usuario no existe o ya esta deshabilitado",
            });
        }
        yield prisma.usuarios.update({
            data: { estado: "INACTIVO" },
            where: { id: uid },
        });
        resp.json({
            status: true,
            msg: "Usuario elimiando",
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
exports.eliminarUsuarios = eliminarUsuarios;
