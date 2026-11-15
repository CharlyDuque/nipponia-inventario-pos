const express = require("express");

const ventaController = require(
  "../controllers/ventaController"
);

const validar = require("../middlewares/validar");
const validarObjectId = require(
  "../middlewares/validarObjectId"
);

const {
  crearVentaSchema,
  cancelarVentaSchema,
} = require("../validators/ventaValidator");

const router = express.Router();

router.get(
  "/",
  ventaController.obtenerVentas
);

router.get(
  "/corte",
  ventaController.obtenerCorteCaja
);

router.post(
  "/",
  validar(crearVentaSchema),
  ventaController.registrarVenta
);

router.patch(
  "/:id/cancelar",
  validarObjectId,
  validar(cancelarVentaSchema),
  ventaController.cancelarVenta
);

module.exports = router;