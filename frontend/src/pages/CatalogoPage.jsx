import styles from "./PlaceholderPage.module.css";

function CatalogoPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Vista del cliente
      </p>

      <h1>Catálogo Nipponia</h1>

      <p className={styles.description}>
        Esta será la vista pública del catálogo.
        Mostrará productos activos, categorías,
        buscador y carrito, sin controles de
        administración.
      </p>
    </main>
  );
}

export default CatalogoPage;
