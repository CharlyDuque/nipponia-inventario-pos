const express = require("express");

const ventaController = require(
  "../controllers/ventaController"
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
  crearVentaSchema,
  cancelarVentaSchema,
} = require(
  "../validators/ventaValidator"
);

const router = express.Router();


/**
 * @openapi
 * /api/ventas:
 *   get:
 *     tags:
 *       - Ventas
 *     summary: Obtener historial de ventas
 *     security:
 *       - OperadorPin: []
 *     responses:
 *       200:
 *         description: Historial de ventas completadas y canceladas
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       500:
 *         description: Error interno
 */
router.get(
  "/",
  requerirOperador,
  ventaController.obtenerVentas
);

/**
 * @openapi
 * /api/ventas/corte:
 *   get:
 *     tags:
 *       - Ventas
 *     summary: Obtener corte de caja
 *     description: Calcula el corte utilizando la zona horaria America/Monterrey.
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha local en formato YYYY-MM-DD
 *         example: 2026-11-17
 *     responses:
 *       200:
 *         description: Corte calculado correctamente
 *       400:
 *         description: Fecha inválida
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       500:
 *         description: Error interno
 */
router.get(
  "/corte",
  requerirOperador,
  ventaController.obtenerCorteCaja
);

/**
 * @openapi
 * /api/ventas:
 *   post:
 *     tags:
 *       - Ventas
 *     summary: Registrar una venta
 *     description: Descuenta stock, crea el ticket y completa el pedido asociado dentro de una transacción.
 *     security:
 *       - OperadorPin: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearVenta'
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 *       400:
 *         description: Datos inválidos o efectivo insuficiente
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       404:
 *         description: Producto o pedido no encontrado
 *       409:
 *         description: Stock insuficiente, pedido expirado, completado o no coincidente
 *       500:
 *         description: Error interno
 */
router.post(
  "/",
  requerirOperador,
  validar(crearVentaSchema),
  ventaController.registrarVenta
);

/**
 * @openapi
 * /api/ventas/{id}/cancelar:
 *   patch:
 *     tags:
 *       - Ventas
 *     summary: Cancelar una venta
 *     description: Cancela el ticket y devuelve el stock dentro de una transacción.
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de MongoDB de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelarVenta'
 *     responses:
 *       200:
 *         description: Venta cancelada y stock restaurado
 *       400:
 *         description: Datos o identificador inválidos
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       404:
 *         description: Venta no encontrada
 *       409:
 *         description: Venta ya cancelada o stock imposible de restaurar
 *       500:
 *         description: Error interno
 */
router.patch(
  "/:id/cancelar",
  requerirOperador,
  validarObjectId,
  validar(cancelarVentaSchema),
  ventaController.cancelarVenta
);

module.exports = router;