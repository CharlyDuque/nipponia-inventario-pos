import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "../components/Button/Button";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import Modal from "../components/Modal/Modal";
import Toast from "../components/Toast/Toast";
import ProductoCard from "../components/productos/ProductoCard";
import ProductoForm from "../components/productos/ProductoForm";
import AccesoCatalogoQr from "../components/operador/AccesoCatalogoQr/AccesoCatalogoQr";

import {
  actualizarProducto,
  crearProducto,
  darDeBajaProducto,
  obtenerTodosLosProductos,
  reactivarProducto,
} from "../services/productosApi";

import styles from "./ProductosPage.module.css";

function ProductosPage() {
  const [productos, setProductos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filtro, setFiltro] =
    useState("activos");

  const [
    formularioAbierto,
    setFormularioAbierto,
  ] = useState(false);

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState(null);

  const [
    productoParaBaja,
    setProductoParaBaja,
  ] = useState(null);

  const [
    productoParaReactivar,
    setProductoParaReactivar,
  ] = useState(null);

  const [procesando, setProcesando] =
    useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const cargarProductos = useCallback(
    async (signal) => {
      try {
        setCargando(true);
        setError("");

        const datos =
          await obtenerTodosLosProductos({
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

  const productosFiltrados = useMemo(
    () =>
      productos.filter((producto) => {
        const activo =
          producto.activo !== false;

        if (filtro === "inactivos") {
          return !activo;
        }

        return activo;
      }),
    [productos, filtro]
  );

  const cantidadActivos = useMemo(
    () =>
      productos.filter(
        (producto) =>
          producto.activo !== false
      ).length,
    [productos]
  );

  const cantidadInactivos = useMemo(
    () =>
      productos.filter(
        (producto) =>
          producto.activo === false
      ).length,
    [productos]
  );

  function mostrarToast(
    message,
    type = "success"
  ) {
    setToast({
      open: true,
      message,
      type,
    });
  }

  function cerrarToast() {
    setToast({
      open: false,
      message: "",
      type: "success",
    });
  }

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
    const editando =
      Boolean(productoSeleccionado);

    if (editando) {
      await actualizarProducto(
        productoSeleccionado._id,
        datos
      );
    } else {
      await crearProducto(datos);
    }

    cerrarFormulario();
    await cargarProductos();

    mostrarToast(
      editando
        ? "Producto actualizado correctamente"
        : "Producto creado correctamente"
    );
  }

  async function confirmarBaja() {
    if (!productoParaBaja) {
      return;
    }

    try {
      setProcesando(true);

      await darDeBajaProducto(
        productoParaBaja._id
      );

      setProductoParaBaja(null);
      await cargarProductos();

      mostrarToast(
        "Producto dado de baja correctamente"
      );
    } catch (requestError) {
      mostrarToast(
        requestError.message ||
          "No fue posible dar de baja el producto",
        "error"
      );
    } finally {
      setProcesando(false);
    }
  }

  async function confirmarReactivacion() {
    if (!productoParaReactivar) {
      return;
    }

    try {
      setProcesando(true);

      await reactivarProducto(
        productoParaReactivar._id
      );

      setProductoParaReactivar(null);
      await cargarProductos();

      mostrarToast(
        "Producto reactivado correctamente"
      );
    } catch (requestError) {
      mostrarToast(
        requestError.message ||
          "No fue posible reactivar el producto",
        "error"
      );
    } finally {
      setProcesando(false);
    }
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
            Inventario de Nipponia
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

      <div className={styles.catalogoQr}>
        <AccesoCatalogoQr />
      </div>

      <section
        className={styles.filters}
        aria-label="Filtrar productos"
      >
        <button
          type="button"
          className={`${styles.filterButton} ${
            filtro === "activos"
              ? styles.filterActive
              : ""
          }`}
          onClick={() =>
            setFiltro("activos")
          }
        >
          Activos
          <span>{cantidadActivos}</span>
        </button>

        <button
          type="button"
          className={`${styles.filterButton} ${
            filtro === "inactivos"
              ? styles.filterActive
              : ""
          }`}
          onClick={() =>
            setFiltro("inactivos")
          }
        >
          Inactivos
          <span>{cantidadInactivos}</span>
        </button>
      </section>

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
        productosFiltrados.length === 0 && (
          <section className={styles.message}>
            No hay productos{" "}
            {filtro === "activos"
              ? "activos"
              : "inactivos"}
            .
          </section>
        )}

      {!cargando &&
        !error &&
        productosFiltrados.length > 0 && (
          <>
            <p className={styles.counter}>
              {productosFiltrados.length}{" "}
              productos {filtro}
            </p>

            <section className={styles.grid}>
              {productosFiltrados.map(
                (producto) => (
                  <ProductoCard
                    key={producto._id}
                    producto={producto}
                    onEditar={abrirEdicion}
                    onDarDeBaja={
                      setProductoParaBaja
                    }
                    onReactivar={
                      setProductoParaReactivar
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
          producto={productoSeleccionado}
          onSubmit={guardarProducto}
          onCancel={cerrarFormulario}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(productoParaBaja)}
        title="Dar de baja producto"
        message={
          productoParaBaja
            ? `¿Deseas dar de baja “${productoParaBaja.nombre}”? El producto desaparecerá del inventario activo, pero conservará su historial.`
            : ""
        }
        confirmText="Dar de baja"
        variant="danger"
        loading={procesando}
        onConfirm={confirmarBaja}
        onCancel={() =>
          setProductoParaBaja(null)
        }
      />

      <ConfirmDialog
        open={Boolean(
          productoParaReactivar
        )}
        title="Reactivar producto"
        message={
          productoParaReactivar
            ? `¿Deseas reactivar “${productoParaReactivar.nombre}”? Volverá a aparecer en el inventario activo.`
            : ""
        }
        confirmText="Reactivar"
        variant="secondary"
        loading={procesando}
        onConfirm={
          confirmarReactivacion
        }
        onCancel={() =>
          setProductoParaReactivar(null)
        }
      />

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={cerrarToast}
      />
    </main>
  );
}

export default ProductosPage;