import {
  Link,
  NavLink,
} from "react-router";

import styles from "./ClienteHeader.module.css";

function ClienteHeader() {
  return (
    <header className={styles.header}>
      <Link
        className={styles.brand}
        to="/cliente/catalogo"
        aria-label="Ir al catálogo de Nipponia"
      >
        <span
          className={styles.logo}
          aria-hidden="true"
        >
          N
        </span>

        <div>
          <strong className={styles.name}>
            Nipponia
          </strong>

          <span className={styles.caption}>
            Catálogo local
          </span>
        </div>
      </Link>

      <nav
        className={styles.navigation}
        aria-label="Navegación del catálogo"
      >
        <NavLink
          to="/cliente/catalogo"
          className={({ isActive }) =>
            `${styles.link} ${
              isActive
                ? styles.active
                : ""
            }`
          }
        >
          Catálogo
        </NavLink>

        <NavLink
          to="/cliente/carrito"
          className={({ isActive }) =>
            `${styles.link} ${
              isActive
                ? styles.active
                : ""
            }`
          }
        >
          Carrito
        </NavLink>
      </nav>

      <Link
        className={styles.operadorLink}
        to="/operador/inventario"
      >
        Vista operador
      </Link>
    </header>
  );
}

export default ClienteHeader;
