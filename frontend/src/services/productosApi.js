const PRODUCTOS_URL = "/api/productos";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(
      datos.mensaje ||
        "Ocurrió un error al consultar productos"
    );

    error.status = respuesta.status;
    error.detalles = datos.errores || [];

    throw error;
  }

  return datos;
}

export async function obtenerProductos({
  signal,
} = {}) {
  const respuesta = await fetch(
    PRODUCTOS_URL,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    }
  );

  return procesarRespuesta(respuesta);
}
export async function crearProducto(
  producto
) {
  const respuesta = await fetch(
    PRODUCTOS_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(producto),
    }
  );

  return procesarRespuesta(respuesta);
}

export async function actualizarProducto(
  id,
  producto
) {
  const respuesta = await fetch(
    `${PRODUCTOS_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(producto),
    }
  );

  return procesarRespuesta(respuesta);
}
