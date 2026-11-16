import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";

import styles from "./AppShell.module.css";

function AppShell({
  children,
  currentView = "inventario",
  onNavigate,
}) {
  return (
    <div className={styles.shell}>
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
      />

      <div className={styles.content}>
        {children}
      </div>

      <BottomNav
        currentView={currentView}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default AppShell;
