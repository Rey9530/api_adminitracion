import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { getVentasMensuales, getVentasXTipoDocumento } from "../../controllers/facturacion/estadisticas";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt"; 
router.get(
  "/ventas_menusales",
  [
    validarJWT,  
    check("anio", "El Año es requerido").custom((e) => validar_dato(e, "positivo") ),
    validarCampos,
  ], 
  getVentasMensuales
); 
router.get(
  "/ventas_x_rango",
  [
    validarJWT,  
    check("desde", "El inicio del rango es requerido").isDate(),
    check("hasta", "El fin del rango es requerido").isDate(),
    validarCampos,
  ], 
  getVentasXTipoDocumento
); 
// router.get("/obtener_departamentos", validarJWT, obntenerDepartamentos);
// router.get("/obtener_municipios/:id", validarJWT, obntenerMunicipios);
// router.get("/obtener_factura/:id", validarJWT, obntenerFactura); 
export default router;
