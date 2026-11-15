import styles from "./Button.module.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
}) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
