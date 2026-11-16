import { Link } from "react-router";

import styles from "./PlaceholderPage.module.css";

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>
        Error 404
      </p>

      <h1>Página no encontrada</h1>

      <p className={styles.description}>
        La dirección solicitada no existe.
      </p>

      <Link
        className={styles.link}
        to="/operador/inventario"
      >
        Volver al inventario
      </Link>
    </main>
  );
}

export default NotFoundPage;
