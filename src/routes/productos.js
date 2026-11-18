const express = require("express");

const productoController = require(
  "../controllers/productoController"
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
  crearProductoSchema,
  actualizarProductoSchema,
} = require(
  "../validators/productoValidator"
);

const router = express.Router();
/**
 * @openapi
 * /api/productos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener productos activos
 *     description: Devuelve los productos disponibles para catálogo y caja.
 *     responses:
 *       200:
 *         description: Lista de productos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno
 */
router.get(
  "/",
  productoController.obtenerProductos
);
/**
 * @openapi
 * /api/productos/admin/todos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener todos los productos para administración
 *     security:
 *       - OperadorPin: []
 *     responses:
 *       200:
 *         description: Lista de productos activos e inactivos
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       500:
 *         description: Error interno
 */
router.get(
  "/admin/todos",
  requerirOperador,
  productoController.obtenerTodosLosProductos
);

/**
 * @openapi
 * /api/productos/codigo/{codigo}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Buscar producto activo por código
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: MNG003
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado o inactivo
 */
router.get(
  "/codigo/:codigo",
  productoController.obtenerPorCodigo
);

/**
 * @openapi
 * /api/productos:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear un producto
 *     security:
 *       - OperadorPin: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearProducto'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       409:
 *         description: El código ya está registrado
 *       500:
 *         description: Error interno
 */
router.post(
  "/",
  requerirOperador,
  validar(crearProductoSchema),
  productoController.crearProducto
);

/**
 * @openapi
 * /api/productos/{id}:
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar un producto
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de MongoDB del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarProducto'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos o identificador inválidos
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       404:
 *         description: Producto no encontrado
 *       409:
 *         description: El código ya pertenece a otro producto
 *       500:
 *         description: Error interno
 */
router.put(
  "/:id",
  requerirOperador,
  validarObjectId,
  validar(actualizarProductoSchema),
  productoController.actualizarProducto
);

/**
 * @openapi
 * /api/productos/{id}/reactivar:
 *   patch:
 *     tags:
 *       - Productos
 *     summary: Reactivar un producto
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de MongoDB del producto
 *     responses:
 *       200:
 *         description: Producto reactivado correctamente
 *       400:
 *         description: Identificador inválido
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       404:
 *         description: Producto no encontrado
 *       409:
 *         description: El producto ya estaba activo
 *       500:
 *         description: Error interno
 */
router.patch(
  "/:id/reactivar",
  requerirOperador,
  validarObjectId,
  productoController.reactivarProducto
);

/**
 * @openapi
 * /api/productos/{id}:
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Dar de baja un producto
 *     description: Realiza una baja lógica y conserva el historial del producto.
 *     security:
 *       - OperadorPin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de MongoDB del producto
 *     responses:
 *       200:
 *         description: Producto dado de baja correctamente
 *       400:
 *         description: Identificador inválido
 *       401:
 *         description: PIN de operador ausente o incorrecto
 *       404:
 *         description: Producto no encontrado
 *       409:
 *         description: El producto ya estaba inactivo
 *       500:
 *         description: Error interno
 */
router.delete(
  "/:id",
  requerirOperador,
  validarObjectId,
  productoController.eliminarProducto
);



module.exports = router;