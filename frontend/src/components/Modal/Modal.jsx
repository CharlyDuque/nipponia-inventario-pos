import {
  useEffect,
  useRef,
} from "react";

import styles from "./Modal.module.css";

function Modal({
  open,
  title,
  children,
  onClose,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    dialogRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        <header className={styles.header}>
          <h2
            id="modal-title"
            className={styles.title}
          >
            {title}
          </h2>

          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar ventana"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {children}
        </div>
      </section>
    </div>
  );
}

export default Modal;
