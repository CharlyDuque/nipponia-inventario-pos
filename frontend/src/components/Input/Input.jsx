import styles from "./Input.module.css";

function Input({
  id,
  label,
  error,
  helpText,
  required = false,
  className = "",
  ...inputProps
}) {
  const helpId = helpText
    ? `${id}-help`
    : undefined;

  const errorId = error
    ? `${id}-error`
    : undefined;

  const describedBy = [
    helpId,
    errorId,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[
        styles.field,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label
        htmlFor={id}
        className={styles.label}
      >
        {label}

        {required && (
          <span
            className={styles.required}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <input
        id={id}
        className={`${styles.input} ${
          error ? styles.invalid : ""
        }`}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          describedBy || undefined
        }
        {...inputProps}
      />

      {helpText && !error && (
        <span
          id={helpId}
          className={styles.help}
        >
          {helpText}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
