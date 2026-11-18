import {
  QRCodeSVG,
} from "qrcode.react";

import {
  ExternalLink,
} from "lucide-react";

import styles from "./AccesoCatalogoQr.module.css";

function AccesoCatalogoQr() {
  const baseUrl =
    import.meta.env
      .VITE_PUBLIC_APP_URL ||
    window.location.origin;

  const catalogoUrl =
    `${baseUrl}/cliente/catalogo`;

  return (
    <section className={styles.card}>
      <div>
        <p className={styles.eyebrow}>
          Acceso para clientes
        </p>

        <h2>
          Escanea para abrir el catálogo
        </h2>

        <p className={styles.description}>
          El dispositivo debe estar conectado
          a la misma red local que Nipponia.
        </p>
      </div>

      <div className={styles.qrContainer}>
        <QRCodeSVG
          value={catalogoUrl}
          size={240}
          level="M"
          marginSize={4}
          bgColor="#ffffff"
          fgColor="#111420"
          title="Código QR de acceso al catálogo Nipponia"
          className={styles.qr}
        />
      </div>

      <a
        className={styles.link}
        href={catalogoUrl}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink
          size={18}
          aria-hidden="true"
        />

        Abrir catálogo
      </a>

      <code className={styles.address}>
        {catalogoUrl}
      </code>
    </section>
  );
}

export default AccesoCatalogoQr;
