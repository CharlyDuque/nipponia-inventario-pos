const crypto = require("crypto");

function compararSeguro(valorRecibido, valorEsperado) {
  const recibido = Buffer.from(
    String(valorRecibido || "")
  );

  const esperado = Buffer.from(
    String(valorEsperado || "")
  );

  if (recibido.length !== esperado.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    recibido,
    esperado
  );
}

function requerirOperador(req, res, next) {
  const pinConfigurado =
    process.env.OPERADOR_PIN;

  if (!pinConfigurado) {
    console.error(
      "OPERADOR_PIN no está configurado"
    );

    return res.status(500).json({
      mensaje:
        "La seguridad del operador no está configurada",
    });
  }

  const pinRecibido =
    req.get("x-operador-pin");

  if (
    !compararSeguro(
      pinRecibido,
      pinConfigurado
    )
  ) {
    return res.status(401).json({
      mensaje:
        "PIN de operador incorrecto o ausente",
    });
  }

  next();
}

module.exports = requerirOperador;
