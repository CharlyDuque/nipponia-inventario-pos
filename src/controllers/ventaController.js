const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Producto = require("../models/Producto");
const Venta = require("../models/Venta");

const redondearDinero = (cantidad) =>
  Math.round((cantidad + Number.EPSILON) * 100) / 100;

const crearFolio = () => {
  const fecha = new Date();

  const fechaTexto = fecha
    .toISOString()
    .replace(/\D/g, "")
    .slice(0, 14);

  const aleatorio = Math.floor(
    1000 + Math.random() * 9000
  );

  return `NIP-${fechaTexto}-${aleatorio}`;
};

exports.registrarVenta = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let ventaCreada;

    await session.withTransaction(async () => {
      const productosVendidos = [];
      let total = 0;

      for (const item of req.body.productos) {
        /*
         * El filtro comprueba simultáneamente:
         * - que el producto exista;
         * - que esté activo;
         * - que tenga stock suficiente.
         *
         * El descuento se realiza atómicamente.
         */
        const producto = await Producto.findOneAndUpdate(
          {
            _id: item.productoId,
            activo: { $ne: false },
            stock: { $gte: item.cantidad },
          },
          {
            $inc: {
              stock: -item.cantidad,
            },
          },
            {
                returnDocument: "after",
                session,
            }
        );

        if (!producto) {
          const productoExistente = await Producto.findById(
            item.productoId
          ).session(session);

          if (!productoExistente) {
            throw new Error(
              `PRODUCTO_NO_ENCONTRADO:${item.productoId}`
            );
          }

          if (productoExistente.activo === false) {
            throw new Error(
              `PRODUCTO_INACTIVO:${productoExistente.nombre}`
            );
          }

          throw new Error(
            `STOCK_INSUFICIENTE:${productoExistente.nombre}:${productoExistente.stock}`
          );
        }

        const subtotal = redondearDinero(
          producto.precio * item.cantidad
        );

        total = redondearDinero(total + subtotal);

        productosVendidos.push({
          productoId: producto._id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal,
        });
      }

      const {
        metodoPago,
        efectivoRecibido,
      } = req.body;

      let efectivoGuardado = null;
      let cambio = 0;

      if (metodoPago === "Efectivo") {
        if (efectivoRecibido < total) {
          throw new Error(
            `EFECTIVO_INSUFICIENTE:${total}`
          );
        }

        efectivoGuardado = redondearDinero(
          efectivoRecibido
        );

        cambio = redondearDinero(
          efectivoRecibido - total
        );
      }

      const documentos = await Venta.create(
        [
          {
            folio: crearFolio(),
            productos: productosVendidos,
            total,
            metodoPago,
            efectivoRecibido: efectivoGuardado,
            cambio,
          },
        ],
        {
          session,
        }
      );

      ventaCreada = documentos[0];
    });

    return res.status(201).json({
      mensaje:
        "Venta registrada y stock actualizado correctamente",
      venta: ventaCreada,
    });
  } catch (error) {
    const [tipo, detalle, dato] =
      error.message.split(":");

    if (tipo === "PRODUCTO_NO_ENCONTRADO") {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
        productoId: detalle,
      });
    }

    if (tipo === "PRODUCTO_INACTIVO") {
      return res.status(400).json({
        mensaje: `El producto ${detalle} está dado de baja`,
      });
    }

    if (tipo === "STOCK_INSUFICIENTE") {
      return res.status(409).json({
        mensaje: `Stock insuficiente para ${detalle}`,
        stockDisponible: Number(dato),
      });
    }

    if (tipo === "EFECTIVO_INSUFICIENTE") {
      return res.status(400).json({
        mensaje:
          "El efectivo recibido es menor que el total de la venta",
        total: Number(detalle),
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        mensaje:
          "Se produjo una colisión al generar el folio; intenta nuevamente",
      });
    }

    console.error("Error al registrar venta:", error);

    return res.status(500).json({
      mensaje: "Error interno al registrar la venta",
    });
  } finally {
    await session.endSession();
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las ventas",
      error: error.message,
    });
  }
};

exports.obtenerCorteCaja = async (req, res) => {
  try {
    const zonaHoraria = "America/Monterrey";

    const fechaSolicitada =
      req.query.fecha ||
      DateTime.now()
        .setZone(zonaHoraria)
        .toFormat("yyyy-MM-dd");

    const fechaLocal = DateTime.fromISO(
      fechaSolicitada,
      {
        zone: zonaHoraria,
      }
    );

    if (!fechaLocal.isValid) {
      return res.status(400).json({
        mensaje:
          "La fecha no es válida. Utiliza el formato YYYY-MM-DD",
      });
    }

    const inicio = fechaLocal
      .startOf("day")
      .toUTC()
      .toJSDate();

    const fin = fechaLocal
      .endOf("day")
      .toUTC()
      .toJSDate();

    const ventas = await Venta.find({
      estado: "Completada",
      createdAt: {
        $gte: inicio,
        $lte: fin,
      },
    }).sort({
      createdAt: -1,
    });

    const totalIngresos = redondearDinero(
      ventas.reduce(
        (acumulado, venta) =>
          acumulado + venta.total,
        0
      )
    );

    const totalEfectivo = redondearDinero(
      ventas
        .filter(
          (venta) =>
            venta.metodoPago === "Efectivo"
        )
        .reduce(
          (acumulado, venta) =>
            acumulado + venta.total,
          0
        )
    );

    const totalTransferencia = redondearDinero(
      ventas
        .filter(
          (venta) =>
            venta.metodoPago === "Transferencia"
        )
        .reduce(
          (acumulado, venta) =>
            acumulado + venta.total,
          0
        )
    );

    return res.status(200).json({
      fecha: fechaSolicitada,
      zonaHoraria,
      periodoUTC: {
        inicio,
        fin,
      },
      cantidadVentas: ventas.length,
      totalIngresos,
      totalEfectivo,
      totalTransferencia,
      ventas,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el corte de caja",
      error: error.message,
    });
  }
};
exports.cancelarVenta = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let ventaCancelada;

    await session.withTransaction(async () => {
      const venta = await Venta.findById(
        req.params.id
      ).session(session);

      if (!venta) {
        throw new Error(
          `VENTA_NO_ENCONTRADA:${req.params.id}`
        );
      }

      if (venta.estado === "Cancelada") {
        throw new Error(
          `VENTA_YA_CANCELADA:${venta.folio}`
        );
      }

      /*
       * Devuelve al inventario cada cantidad vendida.
       * Incluso si el producto está inactivo, el stock
       * histórico se restablece correctamente.
       */
      for (const item of venta.productos) {
        const resultado = await Producto.updateOne(
          {
            _id: item.productoId,
          },
          {
            $inc: {
              stock: item.cantidad,
            },
          },
          {
            session,
          }
        );

        if (resultado.matchedCount === 0) {
          throw new Error(
            `PRODUCTO_DE_VENTA_NO_ENCONTRADO:${item.productoId}:${item.nombre}`
          );
        }
      }

      venta.estado = "Cancelada";
      venta.fechaCancelacion = new Date();
      venta.motivoCancelacion = req.body.motivo;

      await venta.save({
        session,
      });

      ventaCancelada = venta;
    });

    return res.status(200).json({
      mensaje:
        "Venta cancelada y stock devuelto correctamente",
      venta: ventaCancelada,
    });
  } catch (error) {
    const [tipo, detalle, nombre] =
      error.message.split(":");
    if (tipo === "VENTA_NO_ENCONTRADA") {
      return res.status(404).json({
        mensaje: "Venta no encontrada",
        ventaId: detalle,
      });
    }

    if (tipo === "VENTA_YA_CANCELADA") {
      return res.status(409).json({
        mensaje: "La venta ya estaba cancelada",
        folio: detalle,
      });
    }

    if (
      tipo === "PRODUCTO_DE_VENTA_NO_ENCONTRADO"
    ) {
      return res.status(409).json({
        mensaje:
          "No fue posible devolver todo el stock",
        productoId: detalle,
        producto: nombre,
      });
    }

    console.error(
      "Error al cancelar la venta:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al cancelar la venta",
    });
  } finally {
    await session.endSession();
  }
};