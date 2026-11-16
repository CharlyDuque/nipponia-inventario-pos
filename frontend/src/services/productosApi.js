const PRODUCTOS_URL = "/api/productos";

async function procesarRespuesta(respuesta) {
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
        "Ocurrió un error con los productos"
    );

    error.status = respuesta.status;
    error.detalles = datos.errores || [];
    error.datos = datos;

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

export async function obtenerTodosLosProductos({
  signal,
} = {}) {
  const respuesta = await fetch(
    `${PRODUCTOS_URL}/admin/todos`,
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

export async function crearProducto(producto) {
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

export async function darDeBajaProducto(id) {
  const respuesta = await fetch(
    `${PRODUCTOS_URL}/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );

  return procesarRespuesta(respuesta);
}

export async function reactivarProducto(id) {
  const respuesta = await fetch(
    `${PRODUCTOS_URL}/${id}/reactivar`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
    }
  );

  return procesarRespuesta(respuesta);
}