import {
  useMemo,
  useState,
} from "react";

import {
  ScanLine,
  Trash2,
} from "lucide-react";

import Button from "../components/Button/Button";
import Toast from "../components/Toast/Toast";

import {
  validarPedidoQr,
} from "../utils/pedidoQr";

import {
  obtenerTodosLosProductos,
} from "../services/productosApi";

import styles from "./CajaPage.module.css";

import {
  obtenerPedidoOperador,
} from "../services/pedidosApi";

function redondearDinero(valor) {
  return (
    Math.round(
      (valor + Number.EPSILON) * 100
    ) / 100
  );
}

import Modal from "../components/Modal/Modal";
import PagoForm from "../components/caja/PagoForm/PagoForm";
import TicketVenta from "../components/caja/TicketVenta/TicketVenta";

import {
  registrarVenta,
} from "../services/ventasApi";


function CajaPage() {
  const [contenidoQr, setContenidoQr] =
    useState("");

  const [pedido, setPedido] =
    useState([]);

  const [pedidoId, setPedidoId] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [
    pagoAbierto,
    setPagoAbierto,
  ] = useState(false);

  const [
    metodoPago,
    setMetodoPago,
  ] = useState("Efectivo");

  const [
    efectivoRecibido,
    setEfectivoRecibido,
  ] = useState("");

  const [
    procesandoVenta,
    setProcesandoVenta,
  ] = useState(false);

  const [
    errorPago,
    setErrorPago,
  ] = useState("");

  const [
    ventaCreada,
    setVentaCreada,
  ] = useState(null);

  const total = useMemo(
    () =>
      redondearDinero(
        pedido.reduce(
          (acumulado, item) =>
            acumulado +
            item.subtotal,
          0
        )
      ),
    [pedido]
  );

  const cambio = useMemo(() => {
    if (
      metodoPago !== "Efectivo" ||
      efectivoRecibido === ""
    ) {
      return 0;
    }

    return Math.max(
      0,
      redondearDinero(
        Number(efectivoRecibido) -
        total
      )
    );
  }, [
    metodoPago,
    efectivoRecibido,
    total,
  ]);

  const cantidadTotal = useMemo(
    () =>
      pedido.reduce(
        (acumulado, item) =>
          acumulado +
          item.cantidad,
        0
      ),
    [pedido]
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

  function limpiarPedido() {
    setContenidoQr("");
    setPedido([]);
    setPedidoId("");
  }



  async function cargarPedido() {
    setCargando(true);

    try {
      let datos;

      try {
        datos = JSON.parse(
          contenidoQr.trim()
        );
      } catch {
        throw new Error(
          "El contenido no es un JSON válido"
        );
      }

      if (!validarPedidoQr(datos)) {
        throw new Error(
          "El código no contiene un pedido Nipponia válido"
        );
      }
      const pedidoPersistente =
        await obtenerPedidoOperador(
          datos.pedidoId
        );

      if (
        pedidoPersistente.estado !==
        "Pendiente"
      ) {
        throw new Error(
          `El pedido tiene estado ${pedidoPersistente.estado}`
        );
      }

      const productosQr =
        pedidoPersistente.productos;
      const productosActuales =
        await obtenerTodosLosProductos();

      const productosPorId =
        new Map(
          productosActuales.map(
            (producto) => [
              producto._id,
              producto,
            ]
          )
        );

      const pedidoReconstruido =
        productosQr.map((item) => {
          const producto =
            productosPorId.get(
              item.productoId
            );

          if (!producto) {
            throw new Error(
              `Producto no encontrado: ${item.productoId}`
            );
          }

          if (
            producto.activo === false
          ) {
            throw new Error(
              `${producto.nombre} está dado de baja`
            );
          }

          if (
            producto.stock <
            item.cantidad
          ) {
            throw new Error(
              `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
            );
          }

          const precioUnitario =
            Number(producto.precio);

          const subtotal =
            redondearDinero(
              precioUnitario *
              item.cantidad
            );

          return {
            productoId:
              producto._id,

            codigo:
              producto.codigo,

            nombre:
              producto.nombre,

            cantidad:
              item.cantidad,

            stockDisponible:
              producto.stock,

            precioUnitario,
            subtotal,
          };
        });

      setPedidoId(
        datos.pedidoId
      );

      setPedido(
        pedidoReconstruido
      );

      mostrarToast(
        "Pedido cargado y verificado correctamente"
      );
    } catch (error) {
      setPedidoId("");
      setPedido([]);

      mostrarToast(
        error.message ||
        "No fue posible cargar el pedido",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }

  function abrirPago() {
    setMetodoPago("Efectivo");
    setEfectivoRecibido("");
    setErrorPago("");
    setPagoAbierto(true);
  }

  function cerrarPago() {
    if (procesandoVenta) {
      return;
    }

    setPagoAbierto(false);
    setErrorPago("");
  }

  async function confirmarVenta(event) {
    event.preventDefault();

    setProcesandoVenta(true);
    setErrorPago("");

    try {
      const cuerpo = {
        pedidoId,

        productos: pedido.map(
          (item) => ({
            productoId:
              item.productoId,
            cantidad:
              item.cantidad,
          })
        ),

        metodoPago,
      };

      if (metodoPago === "Efectivo") {
        cuerpo.efectivoRecibido =
          Number(efectivoRecibido);
      }

      const respuesta =
        await registrarVenta(cuerpo);

      setVentaCreada(
        respuesta.venta
      );

      setPagoAbierto(false);
      setPedido([]);
      setPedidoId("");
      setContenidoQr("");

      mostrarToast(
        "Venta registrada correctamente"
      );
    } catch (error) {
      setErrorPago(
        error.message ||
        "No fue posible registrar la venta"
      );
    } finally {
      setProcesandoVenta(false);
    }
  }

  function finalizarTicket() {
    setVentaCreada(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Operador
          </p>

          <h1>Caja</h1>

          <p className={styles.description}>
            Recibe el contenido del QR y
            verifica el pedido antes del cobro.
          </p>
        </div>

        {pedido.length > 0 && (
          <Button
            variant="outline"
            onClick={limpiarPedido}
          >
            <Trash2
              size={18}
              aria-hidden="true"
            />

            Limpiar pedido
          </Button>
        )}
      </header>

      <section className={styles.layout}>
        <div className={styles.workspace}>
          <section className={styles.reader}>
            <div className={styles.readerTitle}>
              <ScanLine
                size={24}
                aria-hidden="true"
              />

              <div>
                <h2>Recibir pedido QR</h2>

                <p>
                  Pega temporalmente el JSON
                  leído por la cámara.
                </p>
              </div>
            </div>

            <label
              className={styles.field}
              htmlFor="contenido-qr"
            >
              <span>
                Contenido del código QR
              </span>

              

              <textarea
                id="contenido-qr"
                value={contenidoQr}
                onChange={(event) =>
                  setContenidoQr(
                    event.target.value
                  )
                }
                rows="8"
                placeholder='{"tipo":"nipponia-pedido","version":1,...}'
              />
            </label>

            <Button
              variant="secondary"
              size="large"
              fullWidth
              disabled={
                cargando ||
                contenidoQr.trim()
                  .length === 0
              }
              onClick={cargarPedido}
            >
              {cargando
                ? "Verificando…"
                : "Cargar pedido"}
            </Button>
          </section>

          {pedido.length > 0 && (
            <section className={styles.order}>
              <h2>
                Pedido verificado
              </h2>

              <div className={styles.items}>
                {pedido.map((item) => (
                  <article
                    key={item.productoId}
                    className={styles.item}
                  >
                    <div>
                      <span
                        className={styles.code}
                      >
                        {item.codigo}
                      </span>

                      <h3>
                        {item.nombre}
                      </h3>

                      <p>
                        {item.cantidad}
                        {" × "}
                        $
                        {item.precioUnitario
                          .toFixed(2)}
                      </p>
                    </div>

                    <strong
                      className="tabular"
                    >
                      $
                      {item.subtotal
                        .toFixed(2)}
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.summary}>
          <p className={styles.summaryLabel}>
            Resumen de caja
          </p>

          <div className={styles.summaryRow}>
            <span>Unidades</span>
            <strong>
              {cantidadTotal}
            </strong>
          </div>

          <div className={styles.total}>
            <span>Total</span>

            <strong className="tabular">
              ${total.toFixed(2)}
            </strong>
          </div>

          <p className={styles.notice}>
            El precio y el stock se obtuvieron
            nuevamente desde MongoDB.
          </p>

          <Button
            variant="primary"
            size="large"
            fullWidth
            disabled={
              pedido.length === 0
            }
            onClick={abrirPago}
          >
            Continuar al pago
          </Button>
        </aside>
      </section>

      <Modal
        open={pagoAbierto}
        title="Confirmar cobro"
        onClose={cerrarPago}
      >
        <PagoForm
          metodoPago={metodoPago}
          efectivoRecibido={
            efectivoRecibido
          }
          total={total}
          cambio={cambio}
          procesando={procesandoVenta}
          error={errorPago}
          onMetodoChange={
            setMetodoPago
          }
          onEfectivoChange={
            setEfectivoRecibido
          }
          onConfirmar={
            confirmarVenta
          }
          onCancelar={cerrarPago}
        />
      </Modal>

      <Modal
        open={Boolean(ventaCreada)}
        title="Ticket de venta"
        onClose={finalizarTicket}
      >
        {ventaCreada && (
          <TicketVenta
            venta={ventaCreada}
            onClose={finalizarTicket}
          />
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
export default CajaPage;