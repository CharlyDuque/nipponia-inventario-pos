import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  CreditCard,
  RotateCcw,
  Search,
} from "lucide-react";

import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import Toast from "../components/Toast/Toast";

import {
  cancelarVenta,
  obtenerVentas,
} from "../services/ventasApi";

import styles from "./VentasPage.module.css";

function formatearDinero(valor) {
  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
    }
  ).format(Number(valor) || 0);
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(fecha));
}

function VentasPage() {
  const [ventas, setVentas] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [estado, setEstado] =
    useState("Todas");

  const [
    ventaSeleccionada,
    setVentaSeleccionada,
  ] = useState(null);

  const [
    ventaParaCancelar,
    setVentaParaCancelar,
  ] = useState(null);

  const [motivo, setMotivo] =
    useState("");

  const [
    procesandoCancelacion,
    setProcesandoCancelacion,
  ] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const cargarVentas = useCallback(
    async () => {
      try {
        setCargando(true);
        setError("");

        const datos =
          await obtenerVentas();

        setVentas(datos);
      } catch (requestError) {
        setError(
          requestError.message ||
            "No fue posible obtener las ventas"
        );
      } finally {
        setCargando(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  const ventasFiltradas = useMemo(
    () => {
      const termino = busqueda
        .trim()
        .toLowerCase();

      return ventas.filter(
        (venta) => {
          const coincideEstado =
            estado === "Todas" ||
            venta.estado === estado;

          const coincideBusqueda =
            !termino ||
            venta.folio
              ?.toLowerCase()
              .includes(termino) ||
            venta.productos.some(
              (producto) =>
                producto.nombre
                  ?.toLowerCase()
                  .includes(termino) ||
                producto.codigo
                  ?.toLowerCase()
                  .includes(termino)
            );

          return (
            coincideEstado &&
            coincideBusqueda
          );
        }
      );
    },
    [
      ventas,
      busqueda,
      estado,
    ]
  );

  function abrirCancelacion(venta) {
    setVentaSeleccionada(null);
    setVentaParaCancelar(venta);
    setMotivo("");
  }

  function cerrarCancelacion() {
    if (procesandoCancelacion) {
      return;
    }

    setVentaParaCancelar(null);
    setMotivo("");
  }

  async function confirmarCancelacion(
    event
  ) {
    event.preventDefault();

    if (motivo.trim().length < 3) {
      setToast({
        open: true,
        message:
          "El motivo debe tener al menos 3 caracteres",
        type: "error",
      });

      return;
    }

    try {
      setProcesandoCancelacion(
        true
      );

      await cancelarVenta(
        ventaParaCancelar._id,
        motivo.trim()
      );

      cerrarCancelacion();
      await cargarVentas();

      setToast({
        open: true,
        message:
          "Venta cancelada y stock restaurado correctamente",
        type: "success",
      });
    } catch (requestError) {
      setToast({
        open: true,
        message:
          requestError.message ||
          "No fue posible cancelar la venta",
        type: "error",
      });
    } finally {
      setProcesandoCancelacion(
        false
      );
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Administración
          </p>

          <h1>Ventas</h1>

          <p className={styles.description}>
            Historial, detalle y cancelación
            transaccional de tickets.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={cargarVentas}
          disabled={cargando}
        >
          Actualizar
        </Button>
      </header>

      <section className={styles.toolbar}>
        <label className={styles.search}>
          <Search
            size={19}
            aria-hidden="true"
          />

          <input
            type="search"
            value={busqueda}
            onChange={(event) =>
              setBusqueda(
                event.target.value
              )
            }
            placeholder="Buscar folio, producto o código"
          />
        </label>

        <div className={styles.filters}>
          {[
            "Todas",
            "Completada",
            "Cancelada",
          ].map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={`${styles.filter} ${
                estado === opcion
                  ? styles.filterActive
                  : ""
              }`}
              onClick={() =>
                setEstado(opcion)
              }
            >
              {opcion}
            </button>
          ))}
        </div>
      </section>

      {cargando && (
        <section className={styles.message}>
          Cargando ventas…
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
        ventasFiltradas.length === 0 && (
          <section className={styles.message}>
            No hay ventas que coincidan con
            los filtros.
          </section>
        )}

      {!cargando &&
        !error &&
        ventasFiltradas.length > 0 && (
          <section className={styles.list}>
            {ventasFiltradas.map(
              (venta) => (
                <article
                  key={venta._id}
                  className={styles.sale}
                >
                  <div
                    className={
                      styles.saleMain
                    }
                  >
                    <div>
                      <span
                        className={
                          styles.folio
                        }
                      >
                        {venta.folio}
                      </span>

                      <h2>
                        {venta.productos.length}
                        {" producto(s)"}
                      </h2>

                      <p>
                        {formatearFecha(
                          venta.createdAt
                        )}
                      </p>
                    </div>

                    <div
                      className={
                        styles.payment
                      }
                    >
                      {venta.metodoPago ===
                      "Efectivo" ? (
                        <Banknote
                          size={20}
                          aria-hidden="true"
                        />
                      ) : (
                        <CreditCard
                          size={20}
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {venta.metodoPago}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.saleSummary
                    }
                  >
                    <span
                      className={`${styles.status} ${
                        venta.estado ===
                        "Completada"
                          ? styles.completed
                          : styles.cancelled
                      }`}
                    >
                      {venta.estado}
                    </span>

                    <strong
                      className={`${styles.amount} tabular`}
                    >
                      {formatearDinero(
                        venta.total
                      )}
                    </strong>
                  </div>

                  <div
                    className={
                      styles.actions
                    }
                  >
                    <Button
                      variant="outline"
                      onClick={() =>
                        setVentaSeleccionada(
                          venta
                        )
                      }
                    >
                      Ver detalle
                    </Button>

                    {venta.estado ===
                      "Completada" && (
                      <Button
                        variant="danger"
                        onClick={() =>
                          abrirCancelacion(
                            venta
                          )
                        }
                      >
                        <RotateCcw
                          size={17}
                          aria-hidden="true"
                        />

                        Cancelar
                      </Button>
                    )}
                  </div>
                </article>
              )
            )}
          </section>
        )}

      <Modal
        open={Boolean(
          ventaSeleccionada
        )}
        title="Detalle de venta"
        onClose={() =>
          setVentaSeleccionada(null)
        }
      >
        {ventaSeleccionada && (
          <div
            className={styles.detail}
          >
            <div
              className={
                styles.detailHeader
              }
            >
              <div>
                <span>Folio</span>
                <strong>
                  {
                    ventaSeleccionada.folio
                  }
                </strong>
              </div>

              <div>
                <span>Fecha</span>
                <strong>
                  {formatearFecha(
                    ventaSeleccionada
                      .createdAt
                  )}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.detailItems
              }
            >
              {ventaSeleccionada.productos.map(
                (producto) => (
                  <div
                    key={
                      producto.productoId
                    }
                    className={
                      styles.detailItem
                    }
                  >
                    <div>
                      <strong>
                        {producto.nombre}
                      </strong>

                      <span>
                        {producto.codigo}
                        {" · "}
                        {producto.cantidad}
                        {" × "}
                        {formatearDinero(
                          producto
                            .precioUnitario
                        )}
                      </span>
                    </div>

                    <strong
                      className="tabular"
                    >
                      {formatearDinero(
                        producto.subtotal
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div
              className={
                styles.detailTotal
              }
            >
              <span>Total</span>

              <strong className="tabular">
                {formatearDinero(
                  ventaSeleccionada.total
                )}
              </strong>
            </div>

            {ventaSeleccionada
              .estado === "Cancelada" && (
              <div
                className={
                  styles.cancelInfo
                }
              >
                <strong>
                  Venta cancelada
                </strong>

                <span>
                  {
                    ventaSeleccionada
                      .motivoCancelacion
                  }
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(
          ventaParaCancelar
        )}
        title="Cancelar venta"
        onClose={cerrarCancelacion}
      >
        {ventaParaCancelar && (
          <form
            className={
              styles.cancelForm
            }
            onSubmit={
              confirmarCancelacion
            }
          >
            <p>
              Se devolverá el stock de{" "}
              <strong>
                {ventaParaCancelar.folio}
              </strong>
              .
            </p>

            <label>
              <span>
                Motivo de cancelación
              </span>

              <textarea
                rows="4"
                value={motivo}
                onChange={(event) =>
                  setMotivo(
                    event.target.value
                  )
                }
                placeholder="Ej. El cliente solicitó cancelar la compra"
              />
            </label>

            <div
              className={
                styles.cancelActions
              }
            >
              <Button
                type="button"
                variant="outline"
                disabled={
                  procesandoCancelacion
                }
                onClick={
                  cerrarCancelacion
                }
              >
                Volver
              </Button>

              <Button
                type="submit"
                variant="danger"
                disabled={
                  procesandoCancelacion
                }
              >
                {procesandoCancelacion
                  ? "Cancelando…"
                  : "Confirmar cancelación"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

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

export default VentasPage;