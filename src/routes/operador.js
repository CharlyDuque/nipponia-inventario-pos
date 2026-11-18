const express = require("express");

const requerirOperador = require(
  "../middlewares/requerirOperador"
);

const router = express.Router();

/**
 * @openapi
 * /api/operador/verificar:
 *   post:
 *     tags:
 *       - Operador
 *     summary: Verificar el PIN del operador
 *     security:
 *       - OperadorPin: []
 *     responses:
 *       200:
 *         description: Acceso autorizado
 *       401:
 *         description: PIN ausente o incorrecto
 */
router.post(
  "/verificar",
  requerirOperador,
  (req, res) => {
    return res.status(200).json({
      mensaje: "Acceso de operador autorizado",
    });
  }
);

module.exports = router;
