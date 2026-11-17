import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import {
  CartProvider,
} from "./context/CartContext";

import {
  OperadorAuthProvider,
} from "./context/OperadorAuthContext";

import "./styles/tokens.css";
import "./styles/global.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <OperadorAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </OperadorAuthProvider>
    </BrowserRouter>
  </StrictMode>
);