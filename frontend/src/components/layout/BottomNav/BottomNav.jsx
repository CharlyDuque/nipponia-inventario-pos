import { NavLink } from "react-router";

import styles from "./BottomNav.module.css";

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
    id: "corte",
    icon: "📊",
    label: "Corte",
    to: "/operador/corte",
  },
];

function BottomNav() {
  return (
    <nav
      className={styles.nav}
      aria-label="Navegación móvil"
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

          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;