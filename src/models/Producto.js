const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
{
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  nombre: {
    type: String,
    required: true,
    trim: true,
  },

  descripcion: {
    type: String,
    default: "",
  },

  categoria: {
    type: String,
    required: true,
    trim: true,
  },

  precio: {
    type: Number,
    required: true,
    min: 0,
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },

  imagen: {
    type: String,
    default: "",
  },

  activo: {
  type: Boolean,
  default: true,
},

fechaBaja: {
  type: Date,
  default: null,
},

},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Producto", productoSchema);
