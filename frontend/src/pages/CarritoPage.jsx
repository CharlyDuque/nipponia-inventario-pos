import { Link } from "react-router";

import Button from "../components/Button/Button";

import {
  useCart,
} from "../context/CartContext";

import styles from "./CarritoPage.module.css";

function CarritoPage() {
  const {
    items,
    subtotal,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
  } = useCart();

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
    </main>
  );
}

export default CarritoPage;