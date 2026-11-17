const mongoose = require("mongoose");

function validarObjectId(
  req,
  res,
  next
) {
  if (
    !mongoose.isValidObjectId(
      req.params.id
    )
  ) {
    return res.status(400).json({
      mensaje:
        "El identificador no es válido",
    });
  }

  next();
}

module.exports = validarObjectId;