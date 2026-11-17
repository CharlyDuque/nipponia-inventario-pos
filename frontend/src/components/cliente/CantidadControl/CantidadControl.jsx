import {
  Minus,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import styles from "./CantidadControl.module.css";

function CantidadControl({
  value,
  max,
  onChange,
}) {
  const [draft, setDraft] = useState(
    String(value)
  );

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function normalizar(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return value;
    }

    return Math.max(
      1,
      Math.min(
        Math.trunc(numero),
        max
      )
    );
  }

  function confirmar() {
    const nuevaCantidad =
      normalizar(draft);

    setDraft(
      String(nuevaCantidad)
    );

    onChange(nuevaCantidad);
  }

  function disminuir() {
    const nuevaCantidad =
      Math.max(1, value - 1);

    setDraft(
      String(nuevaCantidad)
    );

    onChange(nuevaCantidad);
  }

  function aumentar() {
    const nuevaCantidad =
      Math.min(max, value + 1);

    setDraft(
      String(nuevaCantidad)
    );

    onChange(nuevaCantidad);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmar();

      event.currentTarget.blur();
    }
  }

  return (
    <div className={styles.control}>
      <button
        type="button"
        className={styles.button}
        aria-label="Disminuir cantidad"
        disabled={value <= 1}
        onClick={disminuir}
      >
        <Minus
          size={17}
          aria-hidden="true"
        />
      </button>

      <input
        type="number"
        className={styles.input}
        value={draft}
        min="1"
        max={max}
        step="1"
        inputMode="numeric"
        aria-label="Cantidad"
        onFocus={(event) =>
          event.currentTarget.select()
        }
        onChange={(event) =>
          setDraft(event.target.value)
        }
        onBlur={confirmar}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        className={styles.button}
        aria-label="Aumentar cantidad"
        disabled={value >= max}
        onClick={aumentar}
      >
        <Plus
          size={17}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default CantidadControl;
