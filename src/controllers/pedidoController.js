const Pedido = require(
  "../models/Pedido"
);

const expiracionConfigurada = Number(
  process.env.PEDIDO_EXPIRACION_MINUTOS
);

const DURACION_PEDIDO_MINUTOS =
  Number.isFinite(expiracionConfigurada)
    ? expiracionConfigurada
    : 180;

exports.crearPedido = async (
  req,
  res
) => {
  try {
    const expiraEn =
      DURACION_PEDIDO_MINUTOS > 0
        ? new Date(
            Date.now() +
              DURACION_PEDIDO_MINUTOS *
                60 *
                1000
          )
        : null;

    const pedido =
      await Pedido.create({
        productos:
          req.body.productos,

        expiraEn,
      });

    return res.status(201).json({
      mensaje:
        "Pedido creado correctamente",

      pedido: {
        _id: pedido._id,
        estado: pedido.estado,
        productos:
          pedido.productos,
        expiraEn:
          pedido.expiraEn,
        createdAt:
          pedido.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Error al crear pedido:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al crear el pedido",
    });
  }
};

exports.obtenerEstadoPedido = async (
  req,
  res
) => {
  try {
    const pedido =
      await Pedido.findById(
        req.params.id
      ).select(
        "estado expiraEn ventaId completadoEn createdAt"
      );

    if (!pedido) {
      return res.status(404).json({
        mensaje:
          "Pedido no encontrado",
      });
    }

    if (
  pedido.estado === "Pendiente" &&
  pedido.expiraEn &&
  pedido.expiraEn <= new Date()
) {
      pedido.estado = "Expirado";

      await pedido.save();

      return res.status(200).json(
        pedido
      );
    }

    return res.status(200).json(
      pedido
    );
  } catch (error) {
    return res.status(500).json({
      mensaje:
        "Error al consultar el pedido",
    });
  }
};

exports.obtenerPedidoOperador = async (
  req,
  res
) => {
  try {
    const pedido =
      await Pedido.findById(
        req.params.id
      );

    if (!pedido) {
      return res.status(404).json({
        mensaje:
          "Pedido no encontrado",
      });
    }

    if (
      pedido.estado === "Pendiente" &&
      pedido.expiraEn &&
      pedido.expiraEn <= new Date()
    ) {
      pedido.estado = "Expirado";

      await pedido.save();
    }

    return res.status(200).json(
      pedido
    );
  } catch (error) {
    return res.status(500).json({
      mensaje:
        "Error al obtener el pedido",
    });
  }
};
