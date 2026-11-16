import {
  useEffect,
  useState,
} from "react";

import Button from "../Button/Button";

import styles from "./ProductoCard.module.css";

function ProductoCard({
  producto,
  onEditar,
  onDarDeBaja,
  onReactivar,
}) {
  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    setImageError(false);
  }, [producto.imagen]);

  const activo =
    producto.activo !== false;

  const disponible =
    activo && producto.stock > 0;

  const mostrarImagen =
    producto.imagen && !imageError;

  const precio =
    Number(producto.precio) || 0;

  return (
    <article
      className={`${styles.card} ${
        !activo ? styles.inactive : ""
      }`}
    >
      <div className={styles.imageContainer}>
        {mostrarImagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.image}
            onError={() =>
              setImageError(true)
            }
          />
        ) : (
          <div
            className={styles.placeholder}
            aria-label={`${producto.nombre} sin imagen disponible`}
          >
            <span
              className={styles.placeholderIcon}
              aria-hidden="true"
            >
              ◫
            </span>

            <span>Sin imagen</span>
          </div>
        )}

        {!activo && (
          <span className={styles.inactiveBadge}>
            Producto inactivo
          </span>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.category}>
          {producto.categoria ||
            "Sin categoría"}
        </span>

        <h2 className={styles.title}>
          {producto.nombre}
        </h2>

        <p className={styles.code}>
          Código:{" "}
          {producto.codigo ||
            "Sin código"}
        </p>

        {producto.descripcion && (
          <p className={styles.description}>
            {producto.descripcion}
          </p>
        )}

        <div className={styles.summary}>
          <strong
            className={`${styles.price} tabular`}
          >
            ${precio.toFixed(2)}
          </strong>

          <span
            className={
              disponible
                ? styles.inStock
                : styles.outOfStock
            }
          >
            {!activo
              ? "Inactivo"
              : disponible
                ? `${producto.stock} disponibles`
                : "Agotado"}
          </span>
        </div>

        {activo ? (
          <div className={styles.actions}>
            <Button
              variant="outline"
              fullWidth
              onClick={() =>
                onEditar?.(producto)
              }
            >
              Editar
            </Button>

            <Button
              variant="danger"
              fullWidth
              onClick={() =>
                onDarDeBaja?.(producto)
              }
            >
              Dar de baja
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              onReactivar?.(producto)
            }
          >
            Reactivar producto
          </Button>
        )}
      </div>
    </article>
  );
}

export default ProductoCard;