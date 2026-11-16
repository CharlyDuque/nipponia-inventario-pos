import {
  Link,
  NavLink,
} from "react-router";

import {
  BookOpen,
  ShoppingCart,
} from "lucide-react";

import {
  useCart,
} from "../../../context/CartContext";

import styles from "./ClienteHeader.module.css";

function ClienteHeader() {
  const { cantidadTotal } = useCart();

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
          <BookOpen
            size={19}
            aria-hidden="true"
          />

          <span>Catálogo</span>
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
          <span className={styles.cartIcon}>
            <ShoppingCart
              size={19}
              aria-hidden="true"
            />

            {cantidadTotal > 0 && (
              <span
                className={styles.badge}
                aria-label={`${cantidadTotal} unidades en el carrito`}
              >
                {cantidadTotal > 99
                  ? "99+"
                  : cantidadTotal}
              </span>
            )}
          </span>

          <span>Carrito</span>
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