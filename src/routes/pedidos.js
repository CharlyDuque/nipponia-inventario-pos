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

/**
 * @openapi
 * /api/pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear un pedido pendiente
 *     description: Crea el pedido que posteriormente será representado mediante QR. No reserva stock.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearPedido'
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  "/",
  validar(crearPedidoSchema),
  pedidoController.crearPedido
);


/**
 * @openapi
 * /api/pedidos/{id}/estado:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Consultar el estado público de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado del pedido
 *       400:
 *         description: Identificador inválido
 *       404:
 *         description: Pedido no encontrado
 */
router.get(
  "/:id/estado",
  validarObjectId,
  pedidoController.obtenerEstadoPedido
);


/**
 * @openapi
 * /api/pedidos/{id}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener un pedido para Caja
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido completo
 *       401:
 *         description: PIN ausente o incorrecto
 *       404:
 *         description: Pedido no encontrado
 */
router.get(
  "/:id",
  requerirOperador,
  validarObjectId,
  pedidoController.obtenerPedidoOperador
);

module.exports = router;
