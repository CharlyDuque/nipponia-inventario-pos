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
 *     summary: Obtener productos activos e inactivos
 *     description: Ruta de auditoría. No está protegida por autenticación en el MVP.
 *     responses:
 *       200:
 *         description: Historial completo de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearProducto'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Código duplicado
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
 *     summary: Actualizar parcialmente un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6af93c20b70e915a93752cc8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarProducto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos o identificador inválidos
 *       404:
 *         description: Producto no encontrado
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
 *     summary: Reactivar un producto dado de baja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto reactivado
 *       400:
 *         description: Identificador inválido
 *       404:
 *         description: Producto no encontrado
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
 *     description: Realiza una baja lógica sin eliminar el documento de MongoDB.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto dado de baja
 *       400:
 *         description: Identificador inválido
 *       404:
 *         description: Producto no encontrado
 */
router.delete(
  "/:id",
  requerirOperador,
  validarObjectId,
  productoController.eliminarProducto
);



module.exports = router;