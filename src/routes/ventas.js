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

/**
 * @openapi
 * /api/ventas:
 *   get:
 *     tags:
 *       - Ventas
 *     summary: Obtener historial de ventas
 *     description: Devuelve ventas completadas y canceladas.
 *     responses:
 *       200:
 *         description: Historial de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *       500:
 *         description: Error interno
 */
router.get(
  "/",
  ventaController.obtenerVentas
);

/**
 * @openapi
 * /api/ventas/corte:
 *   get:
 *     tags:
 *       - Ventas
 *     summary: Obtener corte de caja
 *     description: Calcula el corte usando la zona horaria America/Monterrey.
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: false
 *         description: Fecha local en formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-11-15
 *     responses:
 *       200:
 *         description: Corte calculado correctamente
 *       400:
 *         description: Fecha inválida
 *       500:
 *         description: Error interno
 */
router.get(
  "/corte",
  ventaController.obtenerCorteCaja
);

/**
 * @openapi
 * /api/ventas:
 *   post:
 *     tags:
 *       - Ventas
 *     summary: Registrar una venta
 *     description: Calcula el total, descuenta stock y guarda el ticket dentro de una transacción.
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
 *       404:
 *         description: Producto no encontrado
 *       409:
 *         description: Stock insuficiente
 *       500:
 *         description: Error interno
 */
router.post(
  "/",
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de MongoDB de la venta
 *         schema:
 *           type: string
 *         example: 6af95303d3c412bdbf81ad34
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
 *         description: Petición o identificador inválido
 *       404:
 *         description: Venta no encontrada
 *       409:
 *         description: Venta ya cancelada
 *       500:
 *         description: Error interno
 */
router.patch(
  "/:id/cancelar",
  validarObjectId,
  validar(cancelarVentaSchema),
  ventaController.cancelarVenta
);

module.exports = router;