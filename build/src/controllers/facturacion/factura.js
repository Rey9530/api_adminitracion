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
exports.crearFactura = exports.anularFactura = exports.obntenerFactura = exports.obntenerMunicipios = exports.obntenerDepartamentos = exports.obntenerListadoFacturas = exports.obntenerMetodosDePago = exports.buscarClientes = exports.buscarEnCatalogo = exports.getNumeroFactura = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNumeroFactura = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let id_tipo_factura = Number(req.params.id);
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    if (!(id_tipo_factura > 0)) {
        return resp.json({
            status: false,
            msg: "El tipo de factura es incorrecto",
            data: null,
        });
    }
    let tipoFactura = yield prisma.facturasTipos.findFirst({
        where: { id_tipo_factura },
        include: { Bloques: { where: { estado: "ACTIVO", id_sucursal }, take: 1 } },
    });
    if (tipoFactura == null || tipoFactura.Bloques.length == 0) {
        return resp.json({
            status: false,
            msg: "No existe un bloque de facturas configurado para este tipo de factura ",
            data: null,
        });
    }
    else {
        tipoFactura.Bloques = tipoFactura.Bloques[0];
        return resp.json({
            status: true,
            msg: "Success",
            data: tipoFactura,
        });
    }
});
exports.getNumeroFactura = getNumeroFactura;
const buscarEnCatalogo = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { query = "" } = req.body;
    if (query.length == 0) {
        return resp.json({
            status: false,
            msg: "El parametro no es valido",
            data: null,
        });
    }
    let arrayQuery = query.split(" ");
    const data = yield prisma.catalogo.findMany({
        where: {
            OR: arrayQuery.map((contains) => {
                return {
                    nombre: {
                        contains,
                        mode: "insensitive",
                    },
                };
            }),
        },
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
    });
});
exports.buscarEnCatalogo = buscarEnCatalogo;
const buscarClientes = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let { query = "" } = req.body;
    if (query.length == 0) {
        return resp.json({
            status: false,
            msg: "El parametro no es valido",
            data: null,
        });
    }
    let arrayQuery = query.split(" ");
    const data = yield prisma.cliente.findMany({
        where: {
            AND: arrayQuery.map((contains) => {
                return {
                    nombre: {
                        contains,
                        mode: "insensitive",
                    },
                };
            }),
        },
        orderBy: {
            nombre: "desc",
        },
        take: 20,
        include: { Municipio: true },
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
    });
});
exports.buscarClientes = buscarClientes;
const obntenerMetodosDePago = (_ = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.facturasMetodosDePago.findMany({
        where: { estado: "ACTIVO" },
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
    });
});
exports.obntenerMetodosDePago = obntenerMetodosDePago;
const obntenerListadoFacturas = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    var desde = req.query.desde.toString();
    var hasta = req.query.hasta.toString();
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    // fecha.setDate(fecha.getDate() + dias);
    desde = new Date(desde);
    hasta = new Date(hasta);
    hasta.setDate(hasta.getDate() + 1);
    var total_facturado = 0;
    var total_facturas = 0;
    var total_consumidor_final = 0;
    var total_facturas_consumidor_final = 0;
    var total_credito_fiscal = 0;
    var total_facturas_credito_fiscal = 0;
    var total_anuladas = 0;
    var total_facturas_anuladas = 0;
    const data = yield prisma.facturas.findMany({
        where: {
            fecha_creacion: {
                gte: desde,
                lte: hasta,
            },
            id_sucursal
        },
        include: { Bloque: { include: { Tipo: true } } },
        orderBy: [
            {
                id_factura: "asc",
            },
        ],
    });
    data.forEach((e) => {
        var _a, _b, _c, _d;
        total_facturas++;
        total_facturado += (_a = e.total) !== null && _a !== void 0 ? _a : 0;
        if (e.estado == "ANULADA") {
            total_anuladas += (_b = e.total) !== null && _b !== void 0 ? _b : 0;
            total_facturas_anuladas++;
        }
        else if (e.Bloque.Tipo.id_tipo_factura == 1) {
            total_consumidor_final += (_c = e.total) !== null && _c !== void 0 ? _c : 0;
            total_facturas_consumidor_final++;
        }
        else {
            total_credito_fiscal += (_d = e.total) !== null && _d !== void 0 ? _d : 0;
            total_facturas_credito_fiscal++;
        }
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
        contadores: {
            total_facturado,
            total_facturas,
            total_consumidor_final,
            total_facturas_consumidor_final,
            total_credito_fiscal,
            total_facturas_credito_fiscal,
            total_anuladas,
            total_facturas_anuladas,
        },
    });
});
exports.obntenerListadoFacturas = obntenerListadoFacturas;
const obntenerDepartamentos = (_ = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.departamentos.findMany({
        where: { estado: "ACTIVO" },
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
    });
});
exports.obntenerDepartamentos = obntenerDepartamentos;
const obntenerMunicipios = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let id_departamento = Number(req.params.id);
    if (!(id_departamento > 0)) {
        return resp.json({
            status: false,
            msg: "Identificador de departamento incorrecto",
            data: null,
        });
    }
    const data = yield prisma.municipios.findMany({
        where: { estado: "ACTIVO", id_departamento },
    });
    return resp.json({
        status: true,
        msg: "Success",
        data,
    });
});
exports.obntenerMunicipios = obntenerMunicipios;
const obntenerFactura = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let id_factura = Number(req.params.id);
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    const data = yield prisma.facturas.findFirst({
        where: { id_factura, id_sucursal },
        include: {
            FacturasDetalle: true,
            Bloque: {
                select: {
                    Tipo: { select: { nombre: true, id_tipo_factura: true } },
                    tira: true,
                    serie: true,
                },
            },
            Municipio: { select: { nombre: true, Departamento: true } },
            Metodo: true,
        },
    });
    if (!data) {
        return resp.json({
            status: false,
            msg: "La factura no existe",
            data: null,
        });
    }
    const data_sistema = yield prisma.generalData.findFirst();
    return resp.json({
        status: true,
        msg: "Success",
        data,
        data_sistema,
    });
});
exports.obntenerFactura = obntenerFactura;
const anularFactura = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    let id_factura = Number(req.params.id);
    let { ids = 0 } = req.params;
    let id_sucursal = Number(ids);
    const data = yield prisma.facturas.findMany({
        where: { estado: "ACTIVO", id_factura, id_sucursal },
    });
    if (!data) {
        return resp.json({
            status: false,
            msg: "La factura no existe",
            data: null,
        });
    }
    yield prisma.facturas.update({
        where: { id_factura },
        data: { estado: "ANULADA" },
    });
    return resp.json({
        status: true,
        msg: "Factura anulada con exito",
        data: null,
    });
});
exports.anularFactura = anularFactura;
const crearFactura = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { cliente = "", direccion = "", no_registro = "", nit = "", giro = "", id_municipio = null, id_tipo_factura = 0, subtotal = 0, descuento = 0, iva = 0, total = 0, efectivo = 0, tarjeta = 0, cheque = 0, transferencia = 0, credito = 0, id_metodo_pago = 0, id_cliente = 0, id_descuento = null, detalle_factura = [], } = req.body;
        let { ids = 0 } = req.params;
        let id_sucursal = Number(ids);
        const { uid } = req.params;
        const id_usuario = Number(uid);
        if (detalle_factura == null || detalle_factura.length == 0) {
            return resp.json({
                status: false,
                msg: "La factura debe tener detalle",
                data: null,
            });
        }
        efectivo = Number(efectivo);
        id_cliente = Number(id_cliente);
        tarjeta = Number(tarjeta);
        cheque = Number(cheque);
        transferencia = Number(transferencia);
        credito = Number(credito);
        id_municipio = Number(id_municipio);
        id_tipo_factura = Number(id_tipo_factura);
        id_descuento = id_descuento > 0 ? id_descuento : null;
        id_municipio = id_municipio > 0 ? id_municipio : null;
        id_tipo_factura = id_tipo_factura > 0 ? id_tipo_factura : 0;
        const tipoFactura = yield prisma.facturasTipos.findFirst({
            where: { id_tipo_factura },
            include: { Bloques: { where: { estado: "ACTIVO" } } },
        });
        const clientedB = yield prisma.cliente.findFirst({
            where: { id_cliente },
        });
        let error = "";
        if (!(id_usuario > 0)) {
            error = "Error de token, no se detecta al usuario";
        }
        else if (clientedB == null) {
            error = "Por favor seleccione un cliente";
        }
        else if (tipoFactura == null) {
            error = "El tipo de factura no existe";
        }
        else if (tipoFactura.Bloques.length == 0) {
            error = "El tipo de factura no tiene un bloque activo asignado";
        }
        else if (tipoFactura.Bloques[0].actual > tipoFactura.Bloques[0].hasta) {
            error =
                "El bloque de facturas ha finalizado, configure uno nuevo para continuar.";
            yield prisma.facturasBloques.update({
                data: { estado: "INACTIVO" },
                where: { id_bloque: tipoFactura.Bloques[0].id_bloque },
            });
        }
        if (error.length > 0) {
            return resp.json({
                status: false,
                msg: error,
                data: null,
            });
        }
        let db_detalle = [];
        for (let index = 0; index < detalle_factura.length; index++) {
            const detalle = detalle_factura[index];
            if (detalle.nombre != null &&
                detalle.nombre.length > 0 &&
                detalle.id_catalogo != null &&
                detalle.id_catalogo > 0 &&
                detalle.precio_sin_iva != null &&
                detalle.precio_sin_iva > 0 &&
                detalle.precio_con_iva != null &&
                detalle.precio_con_iva > 0 &&
                detalle.cantidad != null &&
                detalle.cantidad > 0 &&
                detalle.subtotal != null &&
                detalle.subtotal > 0 &&
                detalle.descuento != null &&
                detalle.descuento >= 0 &&
                detalle.iva != null &&
                detalle.iva >= 0 &&
                detalle.total != null &&
                detalle.total > 0) {
                db_detalle.push({
                    id_factura: 0,
                    id_catalogo: detalle.id_catalogo,
                    codigo: detalle.codigo,
                    nombre: detalle.nombre,
                    precio_sin_iva: detalle.precio_sin_iva,
                    precio_con_iva: detalle.precio_con_iva,
                    cantidad: detalle.cantidad,
                    subtotal: detalle.subtotal,
                    descuento: detalle.descuento,
                    id_descuento: (detalle.id_descuento != null && detalle.id_descuento) > 0
                        ? detalle.id_descuento
                        : null,
                    iva: detalle.iva,
                    total: detalle.total,
                });
            }
        }
        if (db_detalle.length == 0) {
            return resp.json({
                status: false,
                msg: "El detalle de la factura esta incorrecto",
                data: null,
            });
        }
        const bloque = tipoFactura === null || tipoFactura === void 0 ? void 0 : tipoFactura.Bloques[0];
        const id_bloque = tipoFactura === null || tipoFactura === void 0 ? void 0 : tipoFactura.Bloques[0].id_bloque;
        const numero_factura = bloque === null || bloque === void 0 ? void 0 : bloque.actual.toString().padStart(6, "0");
        const factura = yield prisma.facturas.create({
            data: {
                id_sucursal,
                cliente,
                numero_factura,
                direccion,
                no_registro,
                nit,
                giro,
                id_municipio,
                id_bloque,
                efectivo,
                id_descuento,
                id_cliente,
                tarjeta,
                cheque,
                transferencia,
                credito,
                id_metodo_pago,
                subtotal,
                descuento,
                iva,
                total,
                id_usuario,
            },
        });
        if (factura == null) {
            return resp.json({
                status: false,
                msg: "Ha ocurrido un error al crear la factura favor intentarlo mas tarde",
                data: null,
            });
        }
        db_detalle = db_detalle.map((e) => {
            e.id_factura = factura.id_factura;
            return e;
        });
        //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta
        yield prisma.facturasBloques.update({
            data: { actual: bloque.actual + 1 },
            where: { id_bloque },
        });
        yield prisma.facturasDetalle.createMany({
            data: db_detalle,
        });
        const facturaCreada = yield prisma.facturas.findUnique({
            where: { id_factura: factura.id_factura },
            include: {
                FacturasDetalle: true,
                Bloque: {
                    select: {
                        Tipo: { select: { nombre: true } },
                        tira: true,
                        serie: true,
                    },
                },
            },
        });
        resp.json({
            status: true,
            msg: "Factura creada con exito",
            data: facturaCreada,
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
exports.crearFactura = crearFactura;
