import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router";

import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import PedidoQr from "../components/cliente/PedidoQr/PedidoQr";
import Toast from "../components/Toast/Toast";

import {
  useCart,
} from "../context/CartContext";

import {
  obtenerProductos,
} from "../services/productosApi";

import {
  crearPedidoQr,
} from "../utils/pedidoQr";

import styles from "./CarritoPage.module.css";

import CantidadControl from 
"../components/cliente/CantidadControl/CantidadControl";
function CarritoPage() {
  const {
    items,
    cantidadTotal,
    subtotal,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    sincronizarCarrito,
  } = useCart();

  const [
    qrAbierto,
    setQrAbierto,
  ] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const pedidoQr = useMemo(
    () => crearPedidoQr(items),
    [items]
  );

  useEffect(() => {
    const controller =
      new AbortController();

    let sincronizando = false;

    async function sincronizar() {
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
      window.setInterval(
        sincronizar,
        5000
      );

    function alRecuperarFoco() {
      sincronizar();
    }

    function alCambiarVisibilidad() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        sincronizar();
      }
    }

    window.addEventListener(
      "focus",
      alRecuperarFoco
    );

    document.addEventListener(
      "visibilitychange",
      alCambiarVisibilidad
    );

    return () => {
      controller.abort();

      window.clearInterval(
        intervalId
      );

      window.removeEventListener(
        "focus",
        alRecuperarFoco
      );

      document.removeEventListener(
        "visibilitychange",
        alCambiarVisibilidad
      );
    };
  }, [sincronizarCarrito]);

  async function prepararPedido() {
    try {
      const productosActuales =
        await obtenerProductos();

      const cambios =
        sincronizarCarrito(
          productosActuales
        );

      const huboCambios =
        cambios.eliminados.length > 0 ||
        cambios.cantidadesAjustadas
          .length > 0 ||
        cambios.preciosActualizados
          .length > 0;

      if (huboCambios) {
        setToast({
          open: true,
          message:
            "El carrito cambió al verificar el inventario. Revísalo antes de generar el QR.",
          type: "info",
        });

        return;
      }

      if (items.length === 0) {
        setToast({
          open: true,
          message:
            "El carrito está vacío",
          type: "error",
        });

        return;
      }

      setQrAbierto(true);
    } catch {
      setToast({
        open: true,
        message:
          "No fue posible verificar el pedido",
        type: "error",
      });
    }
  }

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <section className={styles.empty}>
          <p className={styles.eyebrow}>
            Cliente
          </p>

          <h1>
            Tu carrito está vacío
          </h1>

          <p>
            Agrega productos desde el
            catálogo para preparar tu pedido.
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
          onClose={() =>
            setToast({
              open: false,
              message: "",
              type: "success",
            })
          }
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
            Revisa las cantidades antes de
            presentar el pedido en caja.
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
                  $
                  {Number(
                    item.precio
                  ).toFixed(2)}
                  {" "}
                  por unidad
                </p>
              </div>

              <div className={styles.controls}>
                <div className={styles.quantity}>
  <span>Cantidad</span>

  <CantidadControl
    value={item.cantidad}
    max={item.stockDisponible}
    onChange={(cantidad) =>
      actualizarCantidad(
        item.productoId,
        cantidad
      )
    }
  />
</div>

                <strong
                  className={`${styles.itemSubtotal} tabular`}
                >
                  $
                  {(
                    Number(item.precio) *
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
            <span>Unidades</span>

            <strong>
              {cantidadTotal}
            </strong>
          </div>

          <div className={styles.totalRow}>
            <span>Subtotal</span>

            <strong className="tabular">
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <p className={styles.notice}>
            El stock y los precios se
            confirmarán nuevamente al
            realizar el cobro.
          </p>

          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={prepararPedido}
          >
            Preparar pedido
          </Button>
        </aside>
      </section>

      <Modal
        open={qrAbierto}
        title="Pedido Nipponia"
        onClose={() =>
          setQrAbierto(false)
        }
      >
        <PedidoQr
          contenido={
            pedidoQr.contenido
          }
          cantidadTotal={
            cantidadTotal
          }
          subtotal={subtotal}
          onClose={() =>
            setQrAbierto(false)
          }
        />
      </Modal>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            open: false,
            message: "",
            type: "success",
          })
        }
      />
    </main>
  );
}

export default CarritoPage;