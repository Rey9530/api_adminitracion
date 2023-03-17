"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getenerarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getenerarJWT = (uid, ids = 0) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid, ids
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "1234", {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.getenerarJWT = getenerarJWT;
