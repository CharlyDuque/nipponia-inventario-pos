import { NavLink } from "react-router";

import styles from "./Sidebar.module.css";

const items = [
  {
    id: "inventario",
    icon: "📦",
    label: "Inventario",
    to: "/operador/inventario",
  },
  {
    id: "catalogo",
    icon: "📚",
    label: "Catálogo",
    to: "/cliente/catalogo",
  },
  {
    id: "caja",
    icon: "🧾",
    label: "Caja",
    to: "/operador/caja",
  },
  {
    id: "ventas",
    icon: "💳",
    label: "Ventas",
    to: "/operador/ventas",
  },
  {
    id: "corte",
    icon: "📊",
    label: "Corte",
    to: "/operador/corte",
  },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          N
        </span>

        <span className={styles.brandText}>
          Nipponia POS
        </span>
      </div>

      <nav
        className={styles.navigation}
        aria-label="Navegación del operador"
      >
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `${styles.item} ${
                isActive
                  ? styles.active
                  : ""
              }`
            }
          >
            <span
              className={styles.icon}
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <span className={styles.label}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.serverStatus}>
        <span className={styles.statusDot} />

        <span className={styles.statusText}>
          Servidor local activo
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;