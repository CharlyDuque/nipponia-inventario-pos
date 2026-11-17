import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  eliminarPinOperador,
  guardarPinOperador,
  obtenerPinOperador,
  verificarPinOperador,
} from "../services/operadorApi";

const OperadorAuthContext =
  createContext(null);

export function OperadorAuthProvider({
  children,
}) {
  const [autenticado, setAutenticado] =
    useState(() =>
      Boolean(obtenerPinOperador())
    );

  async function iniciarSesion(pin) {
    await verificarPinOperador(pin);

    guardarPinOperador(pin);
    setAutenticado(true);
  }

  function cerrarSesion() {
    eliminarPinOperador();
    setAutenticado(false);
  }

  return (
    <OperadorAuthContext.Provider
      value={{
        autenticado,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </OperadorAuthContext.Provider>
  );
}

export function useOperadorAuth() {
  const context = useContext(
    OperadorAuthContext
  );

  if (!context) {
    throw new Error(
      "useOperadorAuth debe utilizarse dentro de OperadorAuthProvider"
    );
  }

  return context;
}
