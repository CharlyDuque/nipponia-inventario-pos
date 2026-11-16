import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY =
  "nipponia-carrito";

function cargarCarritoInicial() {
  try {
    const datos =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    return datos
      ? JSON.parse(datos)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}) {
  const [items, setItems] =
    useState(cargarCarritoInicial);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items]);

  function agregarProducto(producto) {
    setItems((actuales) => {
      const existente =
        actuales.find(
          (item) =>
            item.productoId ===
            producto._id
        );

      if (existente) {
        return actuales.map((item) => {
          if (
            item.productoId !==
            producto._id
          ) {
            return item;
          }

          const nuevaCantidad =
            Math.min(
              item.cantidad + 1,
              producto.stock
            );

          return {
            ...item,
            cantidad: nuevaCantidad,
          };
        });
      }

      return [
        ...actuales,
        {
          productoId: producto._id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          stockDisponible:
            producto.stock,
          imagen: producto.imagen || "",
          cantidad: 1,
        },
      ];
    });
  }

  function actualizarCantidad(
    productoId,
    cantidad
  ) {
    setItems((actuales) =>
      actuales.map((item) => {
        if (
          item.productoId !== productoId
        ) {
          return item;
        }

        const cantidadSegura = Math.max(
          1,
          Math.min(
            cantidad,
            item.stockDisponible
          )
        );

        return {
          ...item,
          cantidad: cantidadSegura,
        };
      })
    );
  }

  function eliminarProducto(productoId) {
    setItems((actuales) =>
      actuales.filter(
        (item) =>
          item.productoId !== productoId
      )
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const cantidadTotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.cantidad,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.precio *
            item.cantidad,
        0
      ),
    [items]
  );

  const value = {
    items,
    cantidadTotal,
    subtotal,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}
