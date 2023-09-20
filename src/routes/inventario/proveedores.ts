import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";
import fileUpload from "express-fileupload";
import {
  getRegistros,
  getRegistro,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getBancos,
  getFacturasProveedores,
} from "../../controllers/inventario/proveedores";
import { obntenerTiposContribuyentes } from "../../controllers/facturacion/cliente";

router.use(fileUpload()); 
router.get("/", validarJWT, getRegistros);
router.get("/listado/bancos", validarJWT, getBancos);
router.get("/listado/facturas/:id_proveedor/:id_sucursal", validarJWT, getFacturasProveedores);
router.get("/:id", validarJWT, getRegistro);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("direccion", "La direccion es obligatoria").not().isEmpty(), 
    check("nombre_contac_1", "El nombre del primer contacto es obligatoria").not().isEmpty(), 
    check("telefono_contac_1", "El telefono del primer contacto es obligatoria").not().isEmpty(),   
    check("id_tipo_proveedor", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  crearRegistro
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(), 
    check("direccion", "La direccion es obligatoria").not().isEmpty(), 
    check("nombre_contac_1", "El nombre del primer contacto es obligatoria").not().isEmpty(), 
    check("telefono_contac_1", "El telefono del primer contacto es obligatoria").not().isEmpty(),   
    check("id_tipo_proveedor", "La sucursal es requerida").custom((e) =>
      validar_dato(e, "positivo")
    ),
    validarCampos,
  ],
  actualizarRegistro
);

router.get("/obtener/tipos/contribuyentes", validarJWT, obntenerTiposContribuyentes);
router.delete("/:id", validarJWT, eliminarRegistro);

export default router;
