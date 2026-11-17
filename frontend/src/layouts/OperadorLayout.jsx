import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import AppShell from "../components/layout/AppShell/AppShell";

import {
  useOperadorAuth,
} from "../context/OperadorAuthContext";

function OperadorLayout() {
  const {
    autenticado,
    verificando,
  } = useOperadorAuth();

  const location = useLocation();

  if (verificando) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "1rem",
        }}
      >
        <p>
          Verificando acceso del operador…
        </p>
      </main>
    );
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/operador/acceso"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default OperadorLayout;
