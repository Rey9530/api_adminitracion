"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
//listado de rutas
const usuarios_1 = __importDefault(require("./src/routes/usuarios"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const catalogo_tipos_1 = __importDefault(require("./src/routes/facturacion/catalogo_tipos"));
const catalogo_categorias_1 = __importDefault(require("./src/routes/facturacion/catalogo_categorias"));
const catalogo_1 = __importDefault(require("./src/routes/facturacion/catalogo"));
const factura_1 = __importDefault(require("./src/routes/facturacion/factura"));
const reportes_1 = __importDefault(require("./src/routes/facturacion/reportes"));
const cliente_1 = __importDefault(require("./src/routes/facturacion/cliente"));
const bloques_1 = __importDefault(require("./src/routes/facturacion/bloques"));
const decuentos_1 = __importDefault(require("./src/routes/facturacion/decuentos"));
const sistema_data_1 = __importDefault(require("./src/routes/facturacion/sistema_data"));
//intanciando rutas
app.use('/usuarios', usuarios_1.default);
app.use('/auth', auth_1.default);
//reportes
app.use('/reportes/facturacion', reportes_1.default);
//Facturacion
app.use('/facturacion/cliente', cliente_1.default);
app.use('/facturacion/factura', factura_1.default);
app.use('/facturacion/catalogo', catalogo_1.default);
app.use('/facturacion/catalogo_tipos', catalogo_tipos_1.default);
app.use('/facturacion/catalogo_categorias', catalogo_categorias_1.default);
app.use('/facturacion/bloques', bloques_1.default);
app.use('/facturacion/descuentos', decuentos_1.default);
app.use('/facturacion/sistema_data', sistema_data_1.default);
const port = process.env.PORT || 4000;
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo:', port);
});
