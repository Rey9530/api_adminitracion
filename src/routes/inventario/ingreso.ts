import expres from "express";
const router = expres.Router();
import { check } from "express-validator";
import { 
  buscarProveedor,
  buscarEnCatalogo,
  crearFactura,    
  obntenerListadoFacturas,  
  obtenerBodegas,
  crearCompraServicio, 
  obntenerCompra,
  comprasACheque,
  pagarCheque, 
} from "../../controllers/inventario/ingreso";
import { validarCampos, validar_dato } from "../../middlewares/validar-campos";
import { validarJWT } from "../../middlewares/validar-jwt";

router.post(
  "/",
  [
    validarJWT, 
    check("id_proveedor", "El seleccione un proveedor valido").custom((e) =>
      validar_dato(e, "positivo")
    ),
    // check("id_metodo_pago", "El metodo de pago es obligatorio").custom((e) =>
    //   validar_dato(e, "positivo_0")
    // ),
    check("id_tipo_factura", "El tipo de factura es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ),
    check("detalle_factura", "El tipo de factura es requerido").custom((e) =>
      validar_dato(e, "is_array")
    ),
    validarCampos,
  ],
  crearFactura
); 

router.post(
  "/servicio",
  [
    validarJWT, 
    check("id_proveedor", "El seleccione un proveedor valido").custom((e) =>
      validar_dato(e, "positivo")
    ), 
    check("numero_factura", "El numero de factura es requerido").not().isEmpty(), 
    check("tipo_compra", "El tipo de compra es requerido").not().isEmpty(),
    check("tipo_factura", "El tipo de factura es requerido").not().isEmpty(),
    check("fecha_factura", "La fecha es requerida").isDate(),
    check("monto", "El tipo de factura es obligatorio").custom((e) =>
      validar_dato(e, "positivo")
    ), 
    check("total", "El tipo de factura es obligatorio").custom((e) =>
      validar_dato(e, "positivo_0")
    ), 
    validarCampos,
  ],
  crearCompraServicio
); 
 

router.post(
  "/buscar/catalogo",
  [
    validarJWT,
    check("query", "El cliente es requerido").not().isEmpty(),
    validarCampos,
  ],
  buscarEnCatalogo
);

router.post(
  "/buscar/proveedores",
  [
    validarJWT,
    check("query", "El proveedor es requerido").not().isEmpty(),
    validarCampos,
  ],
  buscarProveedor
);

router.post(
  "/comprasACheque",
  [
    validarJWT,
    check("idsCompras", "Las compras son requerido").not().isEmpty(),
    validarCampos,
  ],
  comprasACheque
);
router.post(
  "/generar_a_cheque",
  [
    validarJWT,
    check("idsProveedores", "Las compras son requerido").not().isEmpty(),
    validarCampos,
  ],
  pagarCheque
);
 
router.get("/obtener/bodegas/:id", validarJWT, obtenerBodegas);
router.get(
  "/obtener_listado_facturas",
  [
    validarJWT,
    check("desde", "El parametro desde es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    check("hasta", "El parametro hasta es requerido y debe ser formato fecha YYYY-mm-dd").not().isEmpty().isDate(),
    validarCampos,
  ],
  obntenerListadoFacturas 
); 
router.get("/obtener_factura/:id", validarJWT, obntenerCompra); 
export default router;
