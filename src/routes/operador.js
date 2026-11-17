const express = require("express");

const requerirOperador = require(
  "../middlewares/requerirOperador"
);

const router = express.Router();

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
