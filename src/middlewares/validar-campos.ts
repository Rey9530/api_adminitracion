import express from "express";
import { validationResult } from "express-validator";

export const validarCampos = (
  req: express.Request,
  resp: express.Response,
  next: Function
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.status(400).json({
      status: true,
      msg: "Error de parametros",
      errors: errors.mapped(),
    });
  }
  next();
  return;
};

export const validar_dato = (
  valor: any,
  tipo: "positivo" |  "positivo_0" | "positivo_decimal" | "is_array" | "string"
) => { 
  if (valor === undefined || valor===null) {
    return false;
  }
  if (tipo == "positivo") {
    return parseInt(valor) > 0 ? true : false;
  }
  if (tipo == "positivo_0") {
    return parseInt(valor) >= 0 ? true : false;
  }
  if (tipo == "positivo_decimal") {
    return parseFloat(valor) > 0 ? true : false;
  }
  if (tipo == "is_array") {
    return Array.isArray(valor) && valor.length > 0 ? true : false;
  }
  return true; 
};
