import { NavLink } from "react-router";

import {
  BookOpen,
  ShoppingCart,
} from "lucide-react";

import {
  useCart,
} from "../../../context/CartContext";

import styles from "./ClienteBottomNav.module.css";

const items = [
  {
    id: "catalogo",
    label: "Catálogo",
    to: "/cliente/catalogo",
    Icon: BookOpen,
  },
  {
    id: "carrito",
    label: "Carrito",
    to: "/cliente/carrito",
    Icon: ShoppingCart,
  },
];

function ClienteBottomNav() {
  const { cantidadTotal } = useCart();

  return (
    <nav
      className={styles.nav}
      aria-label="Navegación móvil del cliente"
    >
      {items.map((item) => {
        const Icon = item.Icon;

        return (
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
            <span className={styles.iconWrapper}>
              <Icon
                size={21}
                aria-hidden="true"
              />

              {item.id === "carrito" &&
                cantidadTotal > 0 && (
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

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default ClienteBottomNav;