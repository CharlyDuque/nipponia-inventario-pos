import {
  crearHeadersOperador,
} from "./operadorApi";

const PEDIDOS_URL = "/api/pedidos";

async function procesarRespuesta(
  respuesta
) {
  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    datos = {
      mensaje:
        "El servidor devolvió una respuesta no válida",
    };
  }

  if (!respuesta.ok) {
    const error = new Error(
      datos.mensaje ||
        "No fue posible procesar el pedido"
    );

    error.status = respuesta.status;
    error.datos = datos;
    error.detalles =
      datos.errores || [];

    throw error;
  }

  return datos;
}

export async function crearPedido(
  productos
) {
  const respuesta = await fetch(
    PEDIDOS_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Accept: "application/json",
      },

      body: JSON.stringify({
        productos,
      }),
    }
  );

  return procesarRespuesta(
    respuesta
  );
}

export async function obtenerEstadoPedido(
  pedidoId,
  {
    signal,
  } = {}
) {
  const respuesta = await fetch(
    `${PEDIDOS_URL}/${pedidoId}/estado`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },

      signal,
    }
  );

  return procesarRespuesta(
    respuesta
  );
}

export async function obtenerPedidoOperador(
  pedidoId
) {
  const respuesta = await fetch(
    `${PEDIDOS_URL}/${pedidoId}`,
    {
      method: "GET",

      headers:
        crearHeadersOperador({
          Accept:
            "application/json",
        }),
    }
  );

  return procesarRespuesta(
    respuesta
  );
}

const PEDIDO_ACTIVO_KEY =
  "nipponia-pedido-activo";

export function guardarPedidoActivo(
  pedido
) {
  window.localStorage.setItem(
    PEDIDO_ACTIVO_KEY,
    JSON.stringify(pedido)
  );
}

export function obtenerPedidoActivo() {
  try {
    const datos =
      window.localStorage.getItem(
        PEDIDO_ACTIVO_KEY
      );

    return datos
      ? JSON.parse(datos)
      : null;
  } catch {
    return null;
  }
}

export function eliminarPedidoActivo() {
  window.localStorage.removeItem(
    PEDIDO_ACTIVO_KEY
  );
}