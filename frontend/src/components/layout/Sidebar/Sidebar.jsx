import styles from "./Sidebar.module.css";

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
    id: "ventas",
    icon: "💳",
    label: "Ventas",
  },
  {
    id: "corte",
    icon: "📊",
    label: "Corte",
  },
];

function Sidebar({
  currentView,
  onNavigate,
}) {
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
              aria-label={item.label}
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

              <span className={styles.label}>
                {item.label}
              </span>
            </button>
          );
        })}
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
