import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ClienteProductoCard from "../components/cliente/ClienteProductoCard/ClienteProductoCard";
import Toast from "../components/Toast/Toast";

import {
  obtenerProductos,
} from "../services/productosApi";

import {
  useCart,
} from "../context/CartContext";

import styles from "./CatalogoPage.module.css";

function CatalogoPage() {
  const [productos, setProductos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const {
    agregarProducto,
  } = useCart();

  useEffect(() => {
    const controller =
      new AbortController();

    async function cargar() {
      try {
        setCargando(true);
        setError("");

        const datos =
          await obtenerProductos({
            signal:
              controller.signal,
          });

        setProductos(datos);
      } catch (requestError) {
        if (
          requestError.name !==
          "AbortError"
        ) {
          setError(
            requestError.message ||
              "No fue posible cargar el catálogo"
          );
        }
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      controller.abort();
    };
  }, []);

  const productosFiltrados = useMemo(
    () => {
      const termino =
        busqueda
          .trim()
          .toLowerCase();

      if (!termino) {
        return productos;
      }

      return productos.filter(
        (producto) =>
          producto.nombre
            ?.toLowerCase()
            .includes(termino) ||
          producto.codigo
            ?.toLowerCase()
            .includes(termino) ||
          producto.categoria
            ?.toLowerCase()
            .includes(termino)
      );
    },
    [productos, busqueda]
  );

  function manejarAgregar(producto) {
    agregarProducto(producto);

    setToast({
      open: true,
      message:
        `${producto.nombre} agregado al carrito`,
      type: "success",
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            Vista del cliente
          </p>

          <h1>Catálogo Nipponia</h1>

          <p className={styles.description}>
            Consulta existencias y prepara tu
            pedido antes de pasar a caja.
          </p>
        </div>

        <label className={styles.search}>
          <span className={styles.searchLabel}>
            Buscar productos
          </span>

          <input
            type="search"
            value={busqueda}
            onChange={(event) =>
              setBusqueda(
                event.target.value
              )
            }
            placeholder="Nombre, código o categoría"
          />
        </label>
      </header>

      {cargando && (
        <section className={styles.message}>
          Cargando catálogo…
        </section>
      )}

      {!cargando && error && (
        <section
          className={`${styles.message} ${styles.error}`}
        >
          {error}
        </section>
      )}

      {!cargando &&
        !error &&
        productosFiltrados.length === 0 && (
          <section className={styles.message}>
            No encontramos productos para
            esa búsqueda.
          </section>
        )}

      {!cargando &&
        !error &&
        productosFiltrados.length > 0 && (
          <>
            <p className={styles.counter}>
              {productosFiltrados.length}
              {" "}
              productos disponibles
            </p>

            <section className={styles.grid}>
              {productosFiltrados.map(
                (producto) => (
                  <ClienteProductoCard
                    key={producto._id}
                    producto={producto}
                    onAgregar={
                      manejarAgregar
                    }
                  />
                )
              )}
            </section>
          </>
        )}

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            open: false,
            message: "",
            type: "success",
          })
        }
      />
    </main>
  );
}

export default CatalogoPage;