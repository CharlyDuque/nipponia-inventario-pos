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
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const timeoutId =
      window.setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseRef.current?.();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.clearTimeout(timeoutId);

      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleBackdrop(event) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onCloseRef.current?.();
    }
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdrop}
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
            onClick={() =>
              onCloseRef.current?.()
            }
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