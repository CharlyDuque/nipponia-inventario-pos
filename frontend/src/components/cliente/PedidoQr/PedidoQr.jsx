import { QRCodeSVG } from "qrcode.react";

import Button from "../../Button/Button";

import styles from "./PedidoQr.module.css";

function PedidoQr({
  contenido,
  cantidadTotal,
  subtotal,
  onClose,
}) {
  return (
    <section className={styles.content}>
      <div className={styles.instructions}>
        <p className={styles.eyebrow}>
          Pedido listo
        </p>

        <h3>
          Presenta este QR en caja
        </h3>

        <p>
          El operador verificará nuevamente
          los precios, la disponibilidad y el
          stock antes de realizar el cobro.
        </p>
      </div>

      <div className={styles.qrContainer}>
        <QRCodeSVG
          value={contenido}
          size={260}
          level="M"
          marginSize={4}
          bgColor="#ffffff"
          fgColor="#111420"
          title="Código QR del pedido Nipponia"
          className={styles.qr}
        />
      </div>

      <dl className={styles.summary}>
        <div>
          <dt>Unidades</dt>
          <dd>{cantidadTotal}</dd>
        </div>

        <div>
          <dt>Subtotal estimado</dt>

          <dd className="tabular">
            ${subtotal.toFixed(2)}
          </dd>
        </div>
      </dl>

      <p className={styles.notice}>
        El QR no reserva productos ni garantiza
        el precio hasta que la caja confirme el
        pedido.
      </p>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={onClose}
      >
        Volver al carrito
      </Button>
    </section>
  );
}

export default PedidoQr;
