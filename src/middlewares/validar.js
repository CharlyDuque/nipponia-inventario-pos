const validar = (schema) => {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const errores = resultado.error.issues.map((issue) => ({
        campo:
          issue.path.length > 0
            ? issue.path.join(".")
            : "body",
        mensaje: issue.message,
      }));

      return res.status(400).json({
        mensaje: "Datos de entrada inválidos",
        errores,
      });
    }

    // Sustituimos el cuerpo por los datos validados y normalizados.
    req.body = resultado.data;

    next();
  };
};

module.exports = validar;