const OPERADOR_PIN_KEY =
  "nipponia-operador-pin";

export function obtenerPinOperador() {
  return (
    window.sessionStorage.getItem(
      OPERADOR_PIN_KEY
    ) || ""
  );
}

export function guardarPinOperador(pin) {
  window.sessionStorage.setItem(
    OPERADOR_PIN_KEY,
    pin
  );
}

export function eliminarPinOperador() {
  window.sessionStorage.removeItem(
    OPERADOR_PIN_KEY
  );
}

export function crearHeadersOperador(
  headers = {}
) {
  const pin = obtenerPinOperador();

  return {
    ...headers,
    "x-operador-pin": pin,
  };
}

export async function verificarPinOperador(
  pin
) {
  const respuesta = await fetch(
    "/api/operador/verificar",
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "x-operador-pin": pin,
      },
    }
  );

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
        "No fue posible verificar el PIN"
    );

    error.status = respuesta.status;

    throw error;
  }

  return datos;
}
