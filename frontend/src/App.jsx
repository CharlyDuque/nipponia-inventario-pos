import { useState } from "react";

import AppShell from
  "./components/layout/AppShell/AppShell";

import ProductosPage from
  "./pages/ProductosPage";

function App() {
  const [
    currentView,
    setCurrentView,
  ] = useState("inventario");

  return (
    <AppShell
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {currentView === "inventario" ? (
        <ProductosPage />
      ) : (
        <main
          style={{
            padding: "2rem",
          }}
        >
          <h1>
            {currentView}
          </h1>

          <p>
            Esta sección se construirá como
            una página independiente.
          </p>
        </main>
      )}
    </AppShell>
  );
}

export default App;