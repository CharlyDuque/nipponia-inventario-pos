import {
  crearHeadersOperador,
} from "./operadorApi";

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
        "No fue posible procesar la venta"
    );

    error.status = respuesta.status;
    error.datos = datos;
    error.detalles = datos.errores || [];

    throw error;
  }

  return datos;
}

export async function registrarVenta(venta) {
  const respuesta = await fetch(
    "/api/ventas",
    {
      method: "POST",

      headers: crearHeadersOperador({
        "Content-Type":
          "application/json",
        Accept: "application/json",
      }),

      body: JSON.stringify(venta),
    }
  );

  return procesarRespuesta(respuesta);
}

export async function obtenerVentas() {
  const respuesta = await fetch(
    "/api/ventas",
    {
      headers: crearHeadersOperador({
        Accept: "application/json",
      }),
    }
  );

  return procesarRespuesta(respuesta);
}

export async function obtenerCorte(fecha) {
  const parametros = fecha
    ? `?fecha=${encodeURIComponent(fecha)}`
    : "";

  const respuesta = await fetch(
    `/api/ventas/corte${parametros}`,
    {
      headers: crearHeadersOperador({
        Accept: "application/json",
      }),
    }
  );

  return procesarRespuesta(respuesta);
}

export async function cancelarVenta(
  id,
  motivo
) {
  const respuesta = await fetch(
    `/api/ventas/${id}/cancelar`,
    {
      method: "PATCH",

      headers: crearHeadersOperador({
        "Content-Type":
          "application/json",
        Accept: "application/json",
      }),

      body: JSON.stringify({
        motivo,
      }),
    }
  );

  return procesarRespuesta(respuesta);
}
