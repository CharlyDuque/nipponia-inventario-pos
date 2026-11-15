import {
  useEffect,
  useState,
} from "react";

import Button from "../components/Button/Button";
import ProductoCard from
  "../components/productos/ProductoCard";

import {
  obtenerProductos,
} from "../services/productosApi";

import styles from "./ProductosPage.module.css";

function ProductosPage() {
  const [
    productos,
    setProductos,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function cargarProductos(signal) {
    try {
      setCargando(true);
      setError("");

      const datos =
        await obtenerProductos({
          signal,
        });

      setProductos(datos);
    } catch (errorPeticion) {
      if (
        errorPeticion.name !== "AbortError"
      ) {
        setError(errorPeticion.message);
      }
    } finally {
      if (!signal?.aborted) {
        setCargando(false);
      }
    }
  }

  useEffect(() => {
    const controller =
      new AbortController();

    cargarProductos(
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, []);

  function manejarEdicion(producto) {
    window.alert(
      `Próximamente editaremos: ${producto.nombre}`
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Administración
          </p>

          <h1 className={styles.title}>
            Productos
          </h1>

          <p className={styles.subtitle}>
            Inventario activo de Nipponia
          </p>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={() =>
            window.alert(
              "Próximamente: crear producto"
            )
          }
        >
          Nuevo producto
        </Button>
      </header>

      {cargando && (
        <section className={styles.message}>
          Cargando productos…
        </section>
      )}

      {!cargando && error && (
        <section
          className={`${styles.message} ${styles.error}`}
        >
          <p>{error}</p>

          <Button
            variant="secondary"
            onClick={() =>
              cargarProductos()
            }
          >
            Reintentar
          </Button>
        </section>
      )}

      {!cargando &&
        !error &&
        productos.length === 0 && (
          <section className={styles.message}>
            No hay productos activos.
          </section>
        )}

      {!cargando &&
        !error &&
        productos.length > 0 && (
          <>
            <p className={styles.counter}>
              {productos.length} productos
              activos
            </p>

            <section className={styles.grid}>
              {productos.map(
                (producto) => (
                  <ProductoCard
                    key={producto._id}
                    producto={producto}
                    onEditar={
                      manejarEdicion
                    }
                  />
                )
              )}
            </section>
          </>
        )}
    </main>
  );
}

export default ProductosPage;
