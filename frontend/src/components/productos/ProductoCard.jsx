import {
  useEffect,
  useState,
} from "react";

import Button from "../Button/Button";

import styles from "./ProductoCard.module.css";

function ProductoCard({
  producto,
  onEditar,
}) {
  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    setImageError(false);
  }, [producto.imagen]);

  const disponible =
    producto.stock > 0;

  const mostrarImagen =
    producto.imagen &&
    !imageError;

  const precio =
    Number(producto.precio) || 0;

  return (
    <article className={styles.card}>
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
            {disponible
              ? `${producto.stock} disponibles`
              : "Agotado"}
          </span>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={() =>
            onEditar?.(producto)
          }
        >
          Editar producto
        </Button>
      </div>
    </article>
  );
}

export default ProductoCard;