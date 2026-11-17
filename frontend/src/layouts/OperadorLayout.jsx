import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import AppShell from
  "../components/layout/AppShell/AppShell";

import {
  useOperadorAuth,
} from "../context/OperadorAuthContext";

function OperadorLayout() {
  const {
    autenticado,
  } = useOperadorAuth();

  const location =
    useLocation();

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