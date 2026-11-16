import styles from "./PlaceholderPage.module.css";

function CajaPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Operador
      </p>

      <h1>Caja</h1>

      <p className={styles.description}>
        Aquí construiremos el carrito de venta,
        el cálculo del total, efectivo recibido,
        cambio y transferencia.
      </p>
    </main>
  );
}

export default CajaPage;
