import { useEffect } from "react";

import styles from "./Toast.module.css";

function Toast({
  open,
  message,
  type = "success",
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timeout = window.setTimeout(
      () => {
        onClose?.();
      },
      duration
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    open,
    duration,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>

      <button
        type="button"
        className={styles.close}
        aria-label="Cerrar notificación"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
