import { Outlet } from "react-router";

import AppShell from
  "../components/layout/AppShell/AppShell";

function OperadorLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default OperadorLayout;
