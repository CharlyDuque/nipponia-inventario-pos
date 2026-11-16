import styles from "./PlaceholderPage.module.css";

function VentasPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Administración
      </p>

      <h1>Ventas</h1>

      <p className={styles.description}>
        Historial de tickets, detalle de ventas
        y cancelaciones transaccionales.
      </p>
    </main>
  );
}

export default VentasPage;
