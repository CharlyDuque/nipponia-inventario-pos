const Producto = require('../models/Producto');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({
  activo: { $ne: false },
});
    return res.status(200).json(productos); // <-- Esto cierra la petición y responde al navegador
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// Buscar por código de barras
exports.obtenerPorCodigo = async (req, res) => {
  try {
    const producto = await Producto.findOne({
  codigo: req.params.codigo,
  activo: { $ne: false },
});
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al buscar producto', error: error.message });
  }
};

// Crear producto nuevo
exports.crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    return res.status(201).json(nuevoProducto);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};


// Dar de baja un producto sin eliminarlo físicamente
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        activo: false,
        fechaBaja: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Producto dado de baja correctamente",
      producto,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al dar de baja el producto",
      error: error.message,
    });
  }
};

// Obtener productos activos e inactivos para auditoría
exports.obtenerTodosLosProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({
      updatedAt: -1,
    });

    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el historial de productos",
      error: error.message,
    });
  }
};
// Reactivar un producto dado de baja
exports.reactivarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        activo: true,
        fechaBaja: null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Producto reactivado correctamente",
      producto,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al reactivar el producto",
      error: error.message,
    });
  }
};