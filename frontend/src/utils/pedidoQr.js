export function crearPedidoQr(items) {
  const pedido = {
    tipo: "nipponia-pedido",
    version: 1,
    creadoEn: new Date().toISOString(),

    productos: items.map((item) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
    })),
  };

  return {
    pedido,
    contenido: JSON.stringify(pedido),
  };
}

export function validarPedidoQr(datos) {
  if (
    !datos ||
    datos.tipo !== "nipponia-pedido" ||
    datos.version !== 1 ||
    !Array.isArray(datos.productos) ||
    datos.productos.length === 0
  ) {
    return false;
  }

  return datos.productos.every(
    (item) =>
      typeof item.productoId === "string" &&
      /^[a-fA-F0-9]{24}$/.test(
        item.productoId
      ) &&
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0
  );
}
