import styles from "./PlaceholderPage.module.css";

function CortePage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Administración
      </p>

      <h1>Corte de caja</h1>

      <p className={styles.description}>
        Resumen por fecha, efectivo,
        transferencias y total de ingresos.
      </p>
    </main>
  );
}

export default CortePage;
