const mongoose = require("mongoose");

const productoVendidoSchema = new mongoose.Schema(
    {
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true,
        },

        codigo: {
            type: String,
            required: true,
        },

        nombre: {
            type: String,
            required: true,
        },

        cantidad: {
            type: Number,
            required: true,
            min: 1,
        },

        precioUnitario: {
            type: Number,
            required: true,
            min: 0,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const ventaSchema = new mongoose.Schema(
    {
        folio: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        productos: {
            type: [productoVendidoSchema],
            required: true,
            validate: {
                validator: (productos) => productos.length > 0,
                message: "La venta debe contener al menos un producto",
            },
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        metodoPago: {
            type: String,
            enum: ["Efectivo", "Transferencia"],
            required: true,
        },

        efectivoRecibido: {
            type: Number,
            default: null,
        },

        cambio: {
            type: Number,
            default: 0,
            min: 0,
        },

        estado: {
            type: String,
            enum: ["Completada", "Cancelada"],
            default: "Completada",
        },

        fechaCancelacion: {
            type: Date,
            default: null,
        },

        motivoCancelacion: {
            type: String,
            default: null,
            maxlength: 300,
        },


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Venta", ventaSchema);