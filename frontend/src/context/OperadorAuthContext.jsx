import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

function OperadorAuthProvider({
  children,
}) {
  const [estado, setEstado] =
    useState("verificando");

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      const pinGuardado =
        obtenerPinOperador();

      if (!pinGuardado) {
        if (activo) {
          setEstado(
            "no-autenticado"
          );
        }

        return;
      }

      try {
        await verificarPinOperador(
          pinGuardado
        );

        if (activo) {
          setEstado("autenticado");
        }
      } catch {
        eliminarPinOperador();

        if (activo) {
          setEstado(
            "no-autenticado"
          );
        }
      }
    }

    verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  async function iniciarSesion(pin) {
    await verificarPinOperador(pin);

    guardarPinOperador(pin);
    setEstado("autenticado");
  }

  function cerrarSesion() {
    eliminarPinOperador();

    setEstado(
      "no-autenticado"
    );
  }

  const value = useMemo(
    () => ({
      estado,

      autenticado:
        estado === "autenticado",

      verificando:
        estado === "verificando",

      iniciarSesion,
      cerrarSesion,
    }),
    [estado]
  );

  return (
    <OperadorAuthContext.Provider
      value={value}
    >
      {children}
    </OperadorAuthContext.Provider>
  );
}

function useOperadorAuth() {
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

export {
  OperadorAuthProvider,
  useOperadorAuth,
};