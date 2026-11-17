const mongoose = require("mongoose");

const itemPedidoSchema =
  new mongoose.Schema(
    {
      productoId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
      },

      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      _id: false,
    }
  );

const pedidoSchema =
  new mongoose.Schema(
    {
      productos: {
        type: [itemPedidoSchema],
        required: true,

        validate: {
          validator: (productos) =>
            productos.length > 0,

          message:
            "El pedido debe contener al menos un producto",
        },
      },

      estado: {
        type: String,

        enum: [
          "Pendiente",
          "Completado",
          "Cancelado",
          "Expirado",
        ],

        default: "Pendiente",
        index: true,
      },

      expiraEn: {
        type: Date,
        required: true,
        index: true,
      },

      ventaId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Venta",
        default: null,
      },

      completadoEn: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Pedido",
    pedidoSchema
  );
