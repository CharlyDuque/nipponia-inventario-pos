const OBJECT_ID_PATTERN =
  /^[a-fA-F0-9]{24}$/;

export function crearPedidoQr(
  pedidoId
) {
  const pedidoQr = {
    tipo: "nipponia-pedido",
    version: 2,
    pedidoId,
  };

  return {
    pedido: pedidoQr,

    contenido:
      JSON.stringify(pedidoQr),
  };
}

export function validarPedidoQr(
  datos
) {
  return Boolean(
    datos &&
      datos.tipo ===
        "nipponia-pedido" &&
      datos.version === 2 &&
      typeof datos.pedidoId ===
        "string" &&
      OBJECT_ID_PATTERN.test(
        datos.pedidoId
      )
  );
}