import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "nipponia-carrito";

function cargarCarritoInicial() {
  try {
    const datos =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!datos) {
      return [];
    }

    const carrito = JSON.parse(datos);

    return Array.isArray(carrito)
      ? carrito
      : [];
  } catch {
    return [];
  }
}

function redondearDinero(valor) {
  return (
    Math.round(
      (valor + Number.EPSILON) * 100
    ) / 100
  );
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
    if (
      producto.activo === false ||
      producto.stock <= 0
    ) {
      return {
        agregado: false,
        mensaje:
          "El producto no está disponible",
      };
    }

    let agregado = false;
    let mensaje = "";

    setItems((actuales) => {
      const existente = actuales.find(
        (item) =>
          item.productoId === producto._id
      );

      if (existente) {
        if (
          existente.cantidad >=
          producto.stock
        ) {
          mensaje =
            "Ya agregaste todo el stock disponible";

          return actuales;
        }

        agregado = true;

        return actuales.map((item) =>
          item.productoId === producto._id
            ? {
                ...item,
                precio: producto.precio,
                stockDisponible:
                  producto.stock,
                cantidad:
                  item.cantidad + 1,
              }
            : item
        );
      }

      agregado = true;

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

    return {
      agregado,
      mensaje,
    };
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

        const numero =
          Number(cantidad);

        const cantidadSegura =
          Number.isFinite(numero)
            ? Math.max(
                1,
                Math.min(
                  Math.trunc(numero),
                  item.stockDisponible
                )
              )
            : 1;

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

  const sincronizarCarrito = useCallback(
  (productosActuales) => {
    const cambios = {
      eliminados: [],
      cantidadesAjustadas: [],
      preciosActualizados: [],
    };

    let carritoModificado = false;

    const sincronizados = [];

    for (const item of items) {
      const productoActual =
        productosActuales.find(
          (producto) =>
            producto._id ===
            item.productoId
        );

      if (
        !productoActual ||
        productoActual.activo === false ||
        productoActual.stock <= 0
      ) {
        cambios.eliminados.push(
          item.nombre
        );

        carritoModificado = true;
        continue;
      }

      let cantidad = item.cantidad;

      if (
        cantidad >
        productoActual.stock
      ) {
        cantidad =
          productoActual.stock;

        cambios.cantidadesAjustadas.push({
          nombre: item.nombre,
          cantidad,
        });

        carritoModificado = true;
      }

      if (
        Number(item.precio) !==
        Number(productoActual.precio)
      ) {
        cambios.preciosActualizados.push({
          nombre: item.nombre,
          precioAnterior:
            item.precio,
          precioNuevo:
            productoActual.precio,
        });

        carritoModificado = true;
      }

      if (
        item.nombre !==
          productoActual.nombre ||
        item.codigo !==
          productoActual.codigo ||
        item.stockDisponible !==
          productoActual.stock ||
        item.imagen !==
          (productoActual.imagen || "")
      ) {
        carritoModificado = true;
      }

      sincronizados.push({
        ...item,
        codigo:
          productoActual.codigo,

        nombre:
          productoActual.nombre,

        precio:
          productoActual.precio,

        stockDisponible:
          productoActual.stock,

        imagen:
          productoActual.imagen || "",

        cantidad,
      });
    }

    if (carritoModificado) {
      setItems(sincronizados);
    }

    return cambios;
  },
  [items]
);

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
      redondearDinero(
        items.reduce(
          (total, item) =>
            total +
            Number(item.precio) *
              item.cantidad,
          0
        )
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      cantidadTotal,
      subtotal,
      agregarProducto,
      actualizarCantidad,
      eliminarProducto,
      vaciarCarrito,
      sincronizarCarrito,
    }),
    [
      items,
      cantidadTotal,
      subtotal,
    ]
  );

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