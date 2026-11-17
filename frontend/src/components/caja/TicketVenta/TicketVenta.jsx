import {
  CheckCircle2,
} from "lucide-react";

import Button from "../../Button/Button";

import styles from "./TicketVenta.module.css";

function TicketVenta({
  venta,
  onClose,
}) {
  return (
    <section className={styles.ticket}>
      <div className={styles.success}>
        <CheckCircle2
          size={44}
          aria-hidden="true"
        />

        <div>
          <p>Venta completada</p>

          <h3>{venta.folio}</h3>
        </div>
      </div>

      <div className={styles.items}>
        {venta.productos.map((item) => (
          <div
            key={item.productoId}
            className={styles.item}
          >
            <div>
              <strong>
                {item.nombre}
              </strong>

              <span>
                {item.cantidad}
                {" × "}
                $
                {item.precioUnitario
                  .toFixed(2)}
              </span>
            </div>

            <strong className="tabular">
              ${item.subtotal.toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <dl className={styles.summary}>
        <div>
          <dt>Método de pago</dt>
          <dd>{venta.metodoPago}</dd>
        </div>

        <div>
          <dt>Total</dt>
          <dd className="tabular">
            ${venta.total.toFixed(2)}
          </dd>
        </div>

        {venta.metodoPago === "Efectivo" && (
          <>
            <div>
              <dt>Efectivo recibido</dt>

              <dd className="tabular">
                $
                {venta.efectivoRecibido
                  .toFixed(2)}
              </dd>
            </div>

            <div>
              <dt>Cambio</dt>

              <dd
                className={`${styles.change} tabular`}
              >
                ${venta.cambio.toFixed(2)}
              </dd>
            </div>
          </>
        )}
      </dl>

      <p className={styles.date}>
        {new Date(
          venta.createdAt
        ).toLocaleString("es-MX")}
      </p>

      <Button
        variant="primary"
        fullWidth
        onClick={onClose}
      >
        Finalizar
      </Button>
    </section>
  );
}

export default TicketVenta;
