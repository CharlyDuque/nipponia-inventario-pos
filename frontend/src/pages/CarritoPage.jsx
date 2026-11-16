import { Link } from "react-router";

import Button from "../components/Button/Button";

import {
  useCart,
} from "../context/CartContext";

import styles from "./CarritoPage.module.css";

import {
  useEffect,
  useState,
} from "react";

import Toast from
  "../components/Toast/Toast";

import {
  obtenerProductos,
} from "../services/productosApi";
function CarritoPage() {
  const {
    items,
    subtotal,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    sincronizarCarrito,
  } = useCart();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
  const controller =
    new AbortController();

  let sincronizando = false;

  async function sincronizar({
    mostrarAvisos = true,
  } = {}) {
    if (sincronizando) {
      return;
    }

    sincronizando = true;

    try {
      const productosActuales =
        await obtenerProductos({
          signal:
            controller.signal,
        });

      const cambios =
        sincronizarCarrito(
          productosActuales
        );

      if (!mostrarAvisos) {
        return;
      }

      const mensajes = [];

      if (
        cambios.eliminados.length > 0
      ) {
        mensajes.push(
          `${cambios.eliminados.length} producto(s) dejaron de estar disponibles`
        );
      }

      if (
        cambios.cantidadesAjustadas
          .length > 0
      ) {
        mensajes.push(
          `${cambios.cantidadesAjustadas.length} cantidad(es) fueron ajustadas al stock actual`
        );
      }

      if (
        cambios.preciosActualizados
          .length > 0
      ) {
        mensajes.push(
          `${cambios.preciosActualizados.length} precio(s) fueron actualizados`
        );
      }

      if (mensajes.length > 0) {
        setToast({
          open: true,
          message: mensajes.join(". "),
          type: "info",
        });
      }
    } catch (requestError) {
      if (
        requestError.name !==
        "AbortError"
      ) {
        setToast({
          open: true,
          message:
            "No fue posible verificar el inventario actual",
          type: "error",
        });
      }
    } finally {
      sincronizando = false;
    }
  }

  sincronizar();

  const intervalId =
    window.setInterval(() => {
      sincronizar();
    }, 5000);

  function sincronizarAlRecuperarFoco() {
    sincronizar();
  }

  function sincronizarAlMostrarPestaña() {
    if (
      document.visibilityState ===
      "visible"
    ) {
      sincronizar();
    }
  }

  window.addEventListener(
    "focus",
    sincronizarAlRecuperarFoco
  );

  document.addEventListener(
    "visibilitychange",
    sincronizarAlMostrarPestaña
  );

  return () => {
    controller.abort();

    window.clearInterval(
      intervalId
    );

    window.removeEventListener(
      "focus",
      sincronizarAlRecuperarFoco
    );

    document.removeEventListener(
      "visibilitychange",
      sincronizarAlMostrarPestaña
    );
  };
}, [sincronizarCarrito]);

  const cerrarToast = () =>
    setToast({
      open: false,
      message: "",
      type: "success",
    });

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <section className={styles.empty}>
          <p className={styles.eyebrow}>
            Cliente
          </p>

          <h1>Tu carrito está vacío</h1>

          <p>
            Agrega productos desde el catálogo
            para preparar tu pedido.
          </p>

          <Link
            className={styles.catalogLink}
            to="/cliente/catalogo"
          >
            Explorar catálogo
          </Link>
        </section>

        <Toast
          open={toast.open}
          message={toast.message}
          type={toast.type}
          onClose={cerrarToast}
        />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Cliente
          </p>

          <h1>Tu carrito</h1>

          <p className={styles.description}>
            Revisa cantidades antes de presentar
            el pedido en caja.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={vaciarCarrito}
        >
          Vaciar carrito
        </Button>
      </header>

      <section className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <article
              key={item.productoId}
              className={styles.item}
            >
              <div>
                <span className={styles.code}>
                  {item.codigo}
                </span>

                <h2>{item.nombre}</h2>

                <p className={styles.price}>
                  ${Number(
                    item.precio
                  ).toFixed(2)}
                  {" "}
                  por unidad
                </p>
              </div>

              <div className={styles.controls}>
                <label>
                  <span>Cantidad</span>

                  <input
                    type="number"
                    min="1"
                    max={
                      item.stockDisponible
                    }
                    step="1"
                    value={item.cantidad}
                    onChange={(event) =>
                      actualizarCantidad(
                        item.productoId,
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />
                </label>

                <strong
                  className={`${styles.itemSubtotal} tabular`}
                >
                  $
                  {(
                    item.precio *
                    item.cantidad
                  ).toFixed(2)}
                </strong>

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() =>
                    eliminarProducto(
                      item.productoId
                    )
                  }
                >
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.summary}>
          <p>Resumen del pedido</p>

          <div className={styles.totalRow}>
            <span>Subtotal</span>

            <strong className="tabular">
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <p className={styles.notice}>
            El stock se confirmará nuevamente
            al realizar el cobro.
          </p>

          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() =>
              window.alert(
                "El siguiente paso será generar el QR del pedido"
              )
            }
          >
            Preparar pedido
          </Button>
        </aside>
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={cerrarToast}
      />
    </main>
  );
}

export default CarritoPage;