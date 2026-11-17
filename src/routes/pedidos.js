const express = require("express");

const pedidoController = require(
  "../controllers/pedidoController"
);

const validar = require(
  "../middlewares/validar"
);

const validarObjectId = require(
  "../middlewares/validarObjectId"
);

const requerirOperador = require(
  "../middlewares/requerirOperador"
);

const {
  crearPedidoSchema,
} = require(
  "../validators/pedidoValidator"
);

const router = express.Router();

router.post(
  "/",
  validar(crearPedidoSchema),
  pedidoController.crearPedido
);

router.get(
  "/:id/estado",
  validarObjectId,
  pedidoController.obtenerEstadoPedido
);

router.get(
  "/:id",
  requerirOperador,
  validarObjectId,
  pedidoController.obtenerPedidoOperador
);

module.exports = router;
