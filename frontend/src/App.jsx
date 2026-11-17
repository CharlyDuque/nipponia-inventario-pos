import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import ClienteLayout from
  "./layouts/ClienteLayout";

import OperadorLayout from
  "./layouts/OperadorLayout";

import CajaPage from
  "./pages/CajaPage";

import CarritoPage from
  "./pages/CarritoPage";

import CatalogoPage from
  "./pages/CatalogoPage";

import CortePage from
  "./pages/CortePage";

import NotFoundPage from
  "./pages/NotFoundPage";

import ProductosPage from
  "./pages/ProductosPage";

import VentasPage from
  "./pages/VentasPage";

import OperadorAccesoPage from
  "./pages/OperadorAccesoPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/operador/inventario"
            replace
          />
        }
      />

      <Route
        path="/operador/acceso"
        element={<OperadorAccesoPage />}
      />

      <Route
        path="/operador"
        element={<OperadorLayout />}
      >
        <Route
          index
          element={
            <Navigate
              to="inventario"
              replace
            />
          }
        />

        <Route
          path="inventario"
          element={<ProductosPage />}
        />

        <Route
          path="caja"
          element={<CajaPage />}
        />

        <Route
          path="ventas"
          element={<VentasPage />}
        />

        <Route
          path="corte"
          element={<CortePage />}
        />
      </Route>

      <Route
        path="/cliente"
        element={<ClienteLayout />}
      >
        <Route
          index
          element={
            <Navigate
              to="catalogo"
              replace
            />
          }
        />

        <Route
          path="catalogo"
          element={<CatalogoPage />}
        />

        <Route
          path="carrito"
          element={<CarritoPage />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;