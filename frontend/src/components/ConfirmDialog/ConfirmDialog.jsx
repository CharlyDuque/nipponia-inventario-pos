import Button from "../Button/Button";
import Modal from "../Modal/Modal";

import styles from "./ConfirmDialog.module.css";

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={
        loading ? undefined : onCancel
      }
    >
      <div className={styles.content}>
        <p className={styles.message}>
          {message}
        </p>

        <footer className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={variant}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Procesando…"
              : confirmText}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
