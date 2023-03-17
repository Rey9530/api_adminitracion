"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarImage = void 0;
const fs_1 = __importDefault(require("fs"));
const borrarImage = (pathViejo) => {
    if (fs_1.default.existsSync(pathViejo)) {
        fs_1.default.unlinkSync(pathViejo);
    }
};
exports.borrarImage = borrarImage;
