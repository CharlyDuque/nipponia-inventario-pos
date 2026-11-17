import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

import {
  useOperadorAuth,
} from "../context/OperadorAuthContext";

import styles from "./OperadorAccesoPage.module.css";

function OperadorAccesoPage() {
  const [pin, setPin] =
    useState("");

  const [error, setError] =
    useState("");

  const [procesando, setProcesando] =
    useState(false);

  const {
    iniciarSesion,
  } = useOperadorAuth();

  const navigate = useNavigate();

  async function manejarEnvio(event) {
    event.preventDefault();

    setError("");
    setProcesando(true);

    try {
      await iniciarSesion(pin);

      navigate(
        "/operador/inventario",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "PIN incorrecto"
      );
    } finally {
      setProcesando(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div
          className={styles.logo}
          aria-hidden="true"
        >
          N
        </div>

        <p className={styles.eyebrow}>
          Acceso restringido
        </p>

        <h1>Operador Nipponia</h1>

        <p className={styles.description}>
          Ingresa el PIN local para administrar
          inventario, caja, ventas y cortes.
        </p>

        <form
          className={styles.form}
          onSubmit={manejarEnvio}
        >
          <Input
            id="operador-pin"
            name="pin"
            type="password"
            label="PIN de operador"
            value={pin}
            onChange={(event) =>
              setPin(event.target.value)
            }
            error={error}
            placeholder="••••••"
            inputMode="numeric"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={
              procesando ||
              pin.length === 0
            }
          >
            {procesando
              ? "Verificando…"
              : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default OperadorAccesoPage;
