import { NavLink } from "react-router";

import styles from "./ClienteBottomNav.module.css";

const items = [
  {
    id: "catalogo",
    icon: "▦",
    label: "Catálogo",
    to: "/cliente/catalogo",
  },
  {
    id: "carrito",
    icon: "🛒",
    label: "Carrito",
    to: "/cliente/carrito",
  },
];

function ClienteBottomNav() {
  return (
    <nav
      className={styles.nav}
      aria-label="Navegación móvil del cliente"
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

export default ClienteBottomNav;
