import {
  NavLink,
  useNavigate,
} from "react-router";

import {
  BarChart3,
  BookOpen,
  LogOut,
  Package,
  ScanLine,
} from "lucide-react";

import {
  useOperadorAuth,
} from "../../../context/OperadorAuthContext";

import styles from "./BottomNav.module.css";

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
    id: "corte",
    Icon: BarChart3,
    label: "Corte",
    to: "/operador/corte",
  },
];

function BottomNav() {
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
    <nav
      className={styles.nav}
      aria-label="Navegación móvil del operador"
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
              size={21}
              aria-hidden="true"
            />

            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <button
        type="button"
        className={styles.logout}
        aria-label="Cerrar sesión"
        onClick={manejarCierreSesion}
      >
        <LogOut
          size={21}
          aria-hidden="true"
        />

        <span>Salir</span>
      </button>
    </nav>
  );
}

export default BottomNav;