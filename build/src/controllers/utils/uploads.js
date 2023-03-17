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
exports.getArchivo = exports.eliminarArchivoCloudinary = exports.subirArchivo = exports.borrarImage = void 0;
const express_1 = __importDefault(require("express"));
const response = express_1.default.response;
const request = express_1.default.request;
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const borrarImage = (pathViejo) => {
    if (fs_1.default.existsSync(pathViejo)) {
        fs_1.default.unlinkSync(pathViejo);
    }
};
exports.borrarImage = borrarImage;
const subirArchivo = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file || Object.keys(file).length === 0) {
        return false;
    }
    const file_ = file.files;
    const nombreCortado = file_.name.split(".");
    const extencion = nombreCortado[nombreCortado.length - 1];
    let extencionesValidad = ["png", "jpg", "jpeg"];
    if (!extencionesValidad.includes(extencion)) {
        return "Extencion incorrecta";
    }
    const nombreArchivo = `${(0, uuid_1.v4)()}.${extencion}`;
    const path = `./uploads/${nombreArchivo}`;
    return new Promise((resolve, _) => {
        file_.mv(path, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                cloudinary.uploader.upload(path).then((result) => {
                    (0, exports.borrarImage)(path);
                    resolve(result);
                });
            }
        });
    }).then((resp) => {
        return resp;
    });
});
exports.subirArchivo = subirArchivo;
const eliminarArchivoCloudinary = (public_id) => {
    return new Promise((resolve, _) => {
        cloudinary.uploader.destroy(public_id).then((result) => {
            resolve(result);
        });
    }).then((resp) => {
        return resp;
    });
};
exports.eliminarArchivoCloudinary = eliminarArchivoCloudinary;
const getArchivo = (req = request, resp = response) => __awaiter(void 0, void 0, void 0, function* () {
    const tipo = req.params.tipo;
    const img = req.params.img;
    const path = path_1.default.join(__dirname, `../uploads/${tipo}/${img}`);
    if (fs_1.default.existsSync(path)) {
        resp.sendFile(path);
    }
    else {
        const path = path_1.default.join(__dirname, `../uploads/no-img.jpg`);
        resp.sendFile(path);
    }
});
exports.getArchivo = getArchivo;
