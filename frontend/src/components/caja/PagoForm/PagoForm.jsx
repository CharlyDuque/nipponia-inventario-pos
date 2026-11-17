import {
  Banknote,
  Landmark,
} from "lucide-react";

import Button from "../../Button/Button";
import Input from "../../Input/Input";

import styles from "./PagoForm.module.css";

function PagoForm({
  metodoPago,
  efectivoRecibido,
  total,
  cambio,
  procesando,
  error,
  onMetodoChange,
  onEfectivoChange,
  onConfirmar,
  onCancelar,
}) {
  const efectivoSuficiente =
    metodoPago !== "Efectivo" ||
    Number(efectivoRecibido) >= total;

  return (
    <form
      className={styles.form}
      onSubmit={onConfirmar}
      noValidate
    >
      <div>
        <p className={styles.label}>
          Método de pago
        </p>

        <div className={styles.methods}>
          <button
            type="button"
            className={`${styles.method} ${
              metodoPago === "Efectivo"
                ? styles.selected
                : ""
            }`}
            onClick={() =>
              onMetodoChange("Efectivo")
            }
          >
            <Banknote
              size={24}
              aria-hidden="true"
            />

            <span>Efectivo</span>
          </button>

          <button
            type="button"
            className={`${styles.method} ${
              metodoPago === "Transferencia"
                ? styles.selected
                : ""
            }`}
            onClick={() =>
              onMetodoChange(
                "Transferencia"
              )
            }
          >
            <Landmark
              size={24}
              aria-hidden="true"
            />

            <span>Transferencia</span>
          </button>
        </div>
      </div>

      <div className={styles.total}>
        <span>Total a cobrar</span>

        <strong className="tabular">
          ${total.toFixed(2)}
        </strong>
      </div>

      {metodoPago === "Efectivo" && (
        <>
          <Input
            id="efectivo-recibido"
            name="efectivoRecibido"
            type="number"
            label="Efectivo recibido"
            value={efectivoRecibido}
            onChange={(event) =>
              onEfectivoChange(
                event.target.value
              )
            }
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder={total.toFixed(2)}
            required
          />

          <div
            className={`${styles.change} ${
              efectivoSuficiente
                ? styles.changeValid
                : styles.changeInvalid
            }`}
          >
            <span>Cambio</span>

            <strong className="tabular">
              ${cambio.toFixed(2)}
            </strong>
          </div>

          {!efectivoSuficiente && (
            <p
              className={styles.warning}
              role="alert"
            >
              El efectivo recibido es menor
              que el total.
            </p>
          )}
        </>
      )}

      {metodoPago === "Transferencia" && (
        <div className={styles.transferNotice}>
          Confirma visualmente la transferencia
          antes de registrar la venta.
        </div>
      )}

      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}

      <footer className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          disabled={procesando}
          onClick={onCancelar}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={
            procesando ||
            !efectivoSuficiente ||
            (
              metodoPago === "Efectivo" &&
              efectivoRecibido === ""
            )
          }
        >
          {procesando
            ? "Registrando…"
            : "Confirmar cobro"}
        </Button>
      </footer>
    </form>
  );
}

export default PagoForm;
