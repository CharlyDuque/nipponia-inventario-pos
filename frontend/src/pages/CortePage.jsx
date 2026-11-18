import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Banknote,
  CalendarDays,
  CreditCard,
  ReceiptText,
  RefreshCw,
  WalletCards,
} from "lucide-react";

import Button from "../components/Button/Button";
import Toast from "../components/Toast/Toast";

import {
  obtenerCorte,
} from "../services/ventasApi";

import styles from "./CortePage.module.css";

function obtenerFechaLocalActual() {
  const fecha = new Date();

  const year = fecha.getFullYear();

  const month = String(
    fecha.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    fecha.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatearDinero(valor) {
  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
    }
  ).format(Number(valor) || 0);
}

function formatearHora(fecha) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ).format(new Date(fecha));
}

function CortePage() {
  const [fecha, setFecha] = useState(
    obtenerFechaLocalActual
  );

  const [corte, setCorte] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const cargarCorte = useCallback(
    async (fechaSeleccionada) => {
      try {
        setCargando(true);
        setError("");

        const datos =
          await obtenerCorte(
            fechaSeleccionada
          );

        setCorte(datos);
      } catch (requestError) {
        const mensaje =
          requestError.message ||
          "No fue posible obtener el corte";

        setError(mensaje);

        setToast({
          open: true,
          message: mensaje,
          type: "error",
        });
      } finally {
        setCargando(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarCorte(fecha);
  }, [
    fecha,
    cargarCorte,
  ]);

  function seleccionarHoy() {
    setFecha(
      obtenerFechaLocalActual()
    );
  }

  function actualizarCorte() {
    cargarCorte(fecha);
  }

  const ventas =
    corte?.ventas || [];

  const totalIngresos =
    corte?.totalIngresos || 0;

  const totalEfectivo =
    corte?.totalEfectivo || 0;

  const totalTransferencia =
    corte?.totalTransferencia || 0;

  const cantidadVentas =
    corte?.cantidadVentas || 0;

  const porcentajeEfectivo =
    totalIngresos > 0
      ? Math.round(
        (
          totalEfectivo /
          totalIngresos
        ) * 100
      )
      : 0;

  const porcentajeTransferencia =
    totalIngresos > 0
      ? Math.round(
        (
          totalTransferencia /
          totalIngresos
        ) * 100
      )
      : 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Administración
          </p>

          <h1>Corte de caja</h1>

          <p className={styles.description}>
            Resumen de ventas completadas por
            fecha y método de pago.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={seleccionarHoy}
          >
            <CalendarDays
              size={18}
              aria-hidden="true"
            />

            Hoy
          </Button>

          <Button
            variant="secondary"
            disabled={cargando}
            onClick={actualizarCorte}
          >
            <RefreshCw
              size={18}
              aria-hidden="true"
            />

            {cargando
              ? "Actualizando…"
              : "Actualizar"}
          </Button>
        </div>
      </header>

      <section className={styles.datePanel}>
        <label htmlFor="fecha-corte">
          Fecha del corte
        </label>

        <input
          id="fecha-corte"
          type="date"
          value={fecha}
          max={obtenerFechaLocalActual()}
          onChange={(event) =>
            setFecha(
              event.target.value
            )
          }
        />

        {corte?.zonaHoraria && (
          <span>
            Zona horaria:{" "}
            {corte.zonaHoraria}
          </span>
        )}
      </section>

      {cargando && !corte && (
        <section className={styles.message}>
          Calculando corte de caja…
        </section>
      )}

      {!cargando && error && (
        <section
          className={`${styles.message} ${styles.error}`}
        >
          {error}
        </section>
      )}

      {corte && !error && (
        <>
          <section
            className={styles.metrics}
            aria-label="Resumen del corte"
          >
            <article className={styles.metric}>
              <span
                className={`${styles.metricIcon} ${styles.gold}`}
              >
                <WalletCards
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <div>
                <span>Total de ingresos</span>

                <strong className="tabular">
                  {formatearDinero(
                    totalIngresos
                  )}
                </strong>
              </div>
            </article>

            <article className={styles.metric}>
              <span
                className={`${styles.metricIcon} ${styles.green}`}
              >
                <Banknote
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <div>
                <span>Efectivo</span>

                <strong className="tabular">
                  {formatearDinero(
                    totalEfectivo
                  )}
                </strong>

                <small>
                  {porcentajeEfectivo}%
                  del total
                </small>
              </div>
            </article>

            <article className={styles.metric}>
              <span
                className={`${styles.metricIcon} ${styles.blue}`}
              >
                <CreditCard
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <div>
                <span>Transferencias</span>

                <strong className="tabular">
                  {formatearDinero(
                    totalTransferencia
                  )}
                </strong>

                <small>
                  {porcentajeTransferencia}%
                  del total
                </small>
              </div>
            </article>

            <article className={styles.metric}>
              <span
                className={`${styles.metricIcon} ${styles.purple}`}
              >
                <ReceiptText
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <div>
                <span>Ventas completadas</span>

                <strong>
                  {cantidadVentas}
                </strong>

                <small>
                  Tickets contabilizados
                </small>
              </div>
            </article>
          </section>

          <section className={styles.breakdown}>
            <div className={styles.breakdownHeader}>
              <div>
                <h2>
                  Distribución de ingresos
                </h2>

                <p>
                  Solo incluye ventas con estado
                  Completada.
                </p>
              </div>

              <strong className="tabular">
                {formatearDinero(
                  totalIngresos
                )}
              </strong>
            </div>

            <div className={styles.progress}>
              {totalIngresos > 0 && (
                <>
                  <span
                    className={styles.cashProgress}
                    style={{
                      width:
                        `${porcentajeEfectivo}%`,
                    }}
                  />

                  <span
                    className={
                      styles.transferProgress
                    }
                    style={{
                      width:
                        `${porcentajeTransferencia}%`,
                    }}
                  />
                </>
              )}
            </div>

            <div className={styles.legend}>
              <span>
                <i
                  className={styles.cashDot}
                />

                Efectivo
              </span>

              <span>
                <i
                  className={
                    styles.transferDot
                  }
                />

                Transferencia
              </span>
            </div>
          </section>

          <section className={styles.salesSection}>
            <header className={styles.salesHeader}>
              <div>
                <h2>
                  Ventas incluidas
                </h2>

                <p>
                  {cantidadVentas}
                  {" ticket(s) del "}
                  {fecha}
                </p>
              </div>
            </header>

            {ventas.length === 0 ? (
              <div className={styles.empty}>
                <ReceiptText
                  size={38}
                  aria-hidden="true"
                />

                <h3>
                  No se registraron ventas
                </h3>

                <p>
                  No hay ventas completadas
                  para la fecha seleccionada.
                </p>
              </div>
            ) : (
              <div className={styles.sales}>
                {ventas.map((venta) => (
                  <article
                    key={venta._id}
                    className={styles.sale}
                  >
                    <div className={styles.saleTime}>
                      <span>
                        {formatearHora(
                          venta.createdAt
                        )}
                      </span>

                      <small>
                        {venta.productos.length}
                        {" producto(s)"}
                      </small>
                    </div>

                    <div className={styles.saleInfo}>
                      <strong>
                        {venta.folio}
                      </strong>

                      <span>
                        {venta.productos
                          .map(
                            (producto) =>
                              producto.nombre
                          )
                          .join(", ")}
                      </span>
                    </div>

                    <div
                      className={
                        styles.salePayment
                      }
                    >
                      {venta.metodoPago ===
                        "Efectivo" ? (
                        <Banknote
                          size={18}
                          aria-hidden="true"
                        />
                      ) : (
                        <CreditCard
                          size={18}
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {venta.metodoPago}
                      </span>
                    </div>

                    <strong
                      className={`${styles.saleAmount} tabular`}
                    >
                      {formatearDinero(
                        venta.total
                      )}
                    </strong>
                  </article>
                ))}
              </div>
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

export default CortePage;