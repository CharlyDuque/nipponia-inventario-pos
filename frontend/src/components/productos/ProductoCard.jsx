import Button from "../Button/Button";
import styles from "./ProductoCard.module.css";

function ProductoCard({
  producto,
  onEditar,
}) {
  const disponible = producto.stock > 0;

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            Sin imagen
          </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.category}>
          {producto.categoria || "Sin categoría"}
        </span>

        <h2 className={styles.title}>
          {producto.nombre}
        </h2>

        <p className={styles.code}>
          Código: {producto.codigo || "Sin código"}
        </p>

        {producto.descripcion && (
          <p className={styles.description}>
            {producto.descripcion}
          </p>
        )}

        <div className={styles.summary}>
          <strong className={styles.price}>
            ${producto.precio.toFixed(2)}
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
          onClick={() => onEditar?.(producto)}
        >
          Editar producto
        </Button>
      </div>
    </article>
  );
}

export default ProductoCard;
