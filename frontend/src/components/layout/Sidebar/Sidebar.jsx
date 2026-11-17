import {
  NavLink,
  useNavigate,
} from "react-router";

import {
  BarChart3,
  BookOpen,
  CreditCard,
  LogOut,
  Package,
  ScanLine,
} from "lucide-react";

import {
  useOperadorAuth,
} from "../../../context/OperadorAuthContext";

import styles from "./Sidebar.module.css";

const items = [
  {
    id: "inventario",
    Icon: Package,
    label: "Inventario",
    to: "/operador/inventario",
  },
  {
    id: "catalogo",
    Icon: BookOpen,
    label: "Catálogo",
    to: "/cliente/catalogo",
  },
  {
    id: "caja",
    Icon: ScanLine,
    label: "Caja",
    to: "/operador/caja",
  },
  {
    id: "ventas",
    Icon: CreditCard,
    label: "Ventas",
    to: "/operador/ventas",
  },
  {
    id: "corte",
    Icon: BarChart3,
    label: "Corte",
    to: "/operador/corte",
  },
];

function Sidebar() {
  const {
    cerrarSesion,
  } = useOperadorAuth();

  const navigate = useNavigate();

  function manejarCierreSesion() {
    cerrarSesion();

    navigate(
      "/operador/acceso",
      {
        replace: true,
      }
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span
          className={styles.logo}
          aria-hidden="true"
        >
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
              <Icon
                className={styles.icon}
                size={20}
                aria-hidden="true"
              />

              <span className={styles.label}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.serverStatus}>
        <span
          className={styles.statusDot}
          aria-hidden="true"
        />

        <span className={styles.statusText}>
          Servidor local activo
        </span>
      </div>

      <button
        type="button"
        className={styles.logout}
        onClick={manejarCierreSesion}
      >
        <LogOut
          size={19}
          aria-hidden="true"
        />

        <span className={styles.logoutLabel}>
          Cerrar sesión
        </span>
      </button>
    </aside>
  );
}

export default Sidebar;