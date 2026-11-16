import {
  useEffect,
  useState,
} from "react";

import Button from "../../Button/Button";

import styles from "./ClienteProductoCard.module.css";

function ClienteProductoCard({
  producto,
  onAgregar,
}) {
  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    setImageError(false);
  }, [producto.imagen]);

  const tieneStock =
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
          <div className={styles.placeholder}>
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
              tieneStock
                ? styles.available
                : styles.soldOut
            }
          >
            {tieneStock
              ? `${producto.stock} disponibles`
              : "Agotado"}
          </span>
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!tieneStock}
          onClick={() =>
            onAgregar(producto)
          }
        >
          {tieneStock
            ? "Agregar al carrito"
            : "Sin existencias"}
        </Button>
      </div>
    </article>
  );
}

export default ClienteProductoCard;
