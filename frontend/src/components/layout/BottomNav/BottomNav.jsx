import styles from "./BottomNav.module.css";

const items = [
  {
    id: "inventario",
    icon: "📦",
    label: "Inventario",
  },
  {
    id: "catalogo",
    icon: "📚",
    label: "Catálogo",
  },
  {
    id: "caja",
    icon: "🧾",
    label: "Caja",
  },
  {
    id: "corte",
    icon: "📊",
    label: "Corte",
  },
];

function BottomNav({
  currentView,
  onNavigate,
}) {
  return (
    <nav
      className={styles.nav}
      aria-label="Navegación móvil"
    >
      {items.map((item) => {
        const active =
          currentView === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.item} ${
              active ? styles.active : ""
            }`}
            aria-current={
              active ? "page" : undefined
            }
            onClick={() =>
              onNavigate?.(item.id)
            }
          >
            <span
              className={styles.icon}
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
