import { Outlet } from "react-router";

import ClienteHeader from "../components/cliente/ClienteHeader/ClienteHeader";
import ClienteBottomNav from "../components/cliente/ClienteBottomNav/ClienteBottomNav";

import styles from "./ClienteLayout.module.css";

function ClienteLayout() {
  return (
    <div className={styles.layout}>
      <ClienteHeader />

      <div className={styles.content}>
        <Outlet />
      </div>

      <ClienteBottomNav />
    </div>
  );
}

export default ClienteLayout;
