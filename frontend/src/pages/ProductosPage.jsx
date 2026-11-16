import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import ProductoCard from "../components/productos/ProductoCard";
import ProductoForm from "../components/productos/ProductoForm";

import {
  actualizarProducto,
  crearProducto,
  obtenerProductos,
} from "../services/productosApi";

import styles from "./ProductosPage.module.css";

function ProductosPage() {
  const [productos, setProductos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    formularioAbierto,
    setFormularioAbierto,
  ] = useState(false);

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState(null);

  const cargarProductos = useCallback(
    async (signal) => {
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
          errorPeticion.name !==
          "AbortError"
        ) {
          setError(
            errorPeticion.message ||
              "No fue posible obtener los productos"
          );
        }
      } finally {
        if (!signal?.aborted) {
          setCargando(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller =
      new AbortController();

    cargarProductos(
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, [cargarProductos]);

  function abrirCreacion() {
    setProductoSeleccionado(null);
    setFormularioAbierto(true);
  }

  function abrirEdicion(producto) {
    setProductoSeleccionado(producto);
    setFormularioAbierto(true);
  }

  function cerrarFormulario() {
    setFormularioAbierto(false);
    setProductoSeleccionado(null);
  }

  async function guardarProducto(datos) {
    if (productoSeleccionado) {
      await actualizarProducto(
        productoSeleccionado._id,
        datos
      );
    } else {
      await crearProducto(datos);
    }

    cerrarFormulario();

    await cargarProductos();
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
          onClick={abrirCreacion}
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
                      abrirEdicion
                    }
                  />
                )
              )}
            </section>
          </>
        )}

      <Modal
        open={formularioAbierto}
        title={
          productoSeleccionado
            ? "Editar producto"
            : "Nuevo producto"
        }
        onClose={cerrarFormulario}
      >
        <ProductoForm
          producto={
            productoSeleccionado
          }
          onSubmit={guardarProducto}
          onCancel={cerrarFormulario}
        />
      </Modal>
    </main>
  );
}

export default ProductosPage;