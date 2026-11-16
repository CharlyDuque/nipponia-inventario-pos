import BottomNav from
  "../BottomNav/BottomNav";

import Sidebar from
  "../Sidebar/Sidebar";

import styles from "./AppShell.module.css";

function AppShell({
  children,
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.content}>
        {children}
      </div>

      <BottomNav />
    </div>
  );
}

export default AppShell;