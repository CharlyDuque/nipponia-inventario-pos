const mongoose = require("mongoose");

const validarObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      mensaje: "El identificador del producto no es válido",
    });
  }

  next();
};

module.exports = validarObjectId;