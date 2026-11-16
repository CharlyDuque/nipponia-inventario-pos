import {
  Link,
} from "react-router";

import styles from "./PlaceholderPage.module.css";

function CarritoPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Cliente
      </p>

      <h1>Tu carrito</h1>

      <p className={styles.description}>
        Aquí aparecerán los productos seleccionados,
        cantidades, subtotal y el QR para presentar
        el pedido en caja.
      </p>

      <Link
        className={styles.link}
        to="/cliente/catalogo"
      >
        Explorar catálogo
      </Link>
    </main>
  );
}

export default CarritoPage;
