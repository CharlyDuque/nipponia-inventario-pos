import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  Camera,
  ImageUp,
  Square,
} from "lucide-react";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

import Button from "../../Button/Button";

import styles from "./QrScanner.module.css";

function QrScanner({
  onScan,
}) {
  const reactId = useId();

  const readerId = reactId.replace(
    /:/g,
    ""
  );

  const scannerRef = useRef(null);

  const [activo, setActivo] =
    useState(false);

  const [procesando, setProcesando] =
    useState(false);

  const [error, setError] =
    useState("");

  async function detenerCamara() {
    const scanner =
      scannerRef.current;

    if (!scanner) {
      setActivo(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      await scanner.clear();
    } catch (stopError) {
      console.warn(
        "No fue posible cerrar completamente el lector:",
        stopError
      );
    } finally {
      scannerRef.current = null;
      setActivo(false);
    }
  }

  async function iniciarCamara() {
    setError("");
    setProcesando(true);

    try {
      await detenerCamara();

      const scanner =
        new Html5Qrcode(
          readerId,
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],

            verbose: false,
          }
        );

      scannerRef.current =
        scanner;

      await scanner.start(
        {
          facingMode:
            "environment",
        },
        {
          fps: 10,

          qrbox: {
            width: 240,
            height: 240,
          },

          aspectRatio: 1,
        },
        async (
          decodedText
        ) => {
          await detenerCamara();

          onScan(decodedText);
        },
        () => {
          // Los intentos sin lectura son normales.
        }
      );

      setActivo(true);
    } catch (cameraError) {
      scannerRef.current = null;
      setActivo(false);

      setError(
        cameraError?.message ||
          "No fue posible abrir la cámara. Usa una imagen o pega el contenido del QR."
      );
    } finally {
      setProcesando(false);
    }
  }

  async function leerImagen(
    event
  ) {
    const archivo =
      event.target.files?.[0];

    event.target.value = "";

    if (!archivo) {
      return;
    }

    setError("");
    setProcesando(true);

    try {
      await detenerCamara();

      const scanner =
        new Html5Qrcode(
          readerId,
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],

            verbose: false,
          }
        );

      scannerRef.current =
        scanner;

      const contenido =
        await scanner.scanFile(
          archivo,
          true
        );

      await scanner.clear();

      scannerRef.current = null;

      onScan(contenido);
    } catch (fileError) {
      setError(
        fileError?.message ||
          "No se encontró un código QR válido en la imagen"
      );
    } finally {
      setProcesando(false);
    }
  }

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        return;
      }

      if (scanner.isScanning) {
        scanner
          .stop()
          .then(() =>
            scanner.clear()
          )
          .catch(() => {});
      } else {
        scanner
          .clear()
          .catch(() => {});
      }
    };
  }, []);

  return (
    <section className={styles.scanner}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Lector QR
          </p>

          <h2>
            Escanear pedido
          </h2>

          <p>
            Usa la cámara o selecciona una
            imagen que contenga el código.
          </p>
        </div>
      </div>

      <div
        id={readerId}
        className={styles.reader}
      />

      <div className={styles.actions}>
        {!activo ? (
          <Button
            variant="secondary"
            disabled={procesando}
            onClick={iniciarCamara}
          >
            <Camera
              size={18}
              aria-hidden="true"
            />

            {procesando
              ? "Abriendo…"
              : "Abrir cámara"}
          </Button>
        ) : (
          <Button
            variant="danger"
            disabled={procesando}
            onClick={detenerCamara}
          >
            <Square
              size={17}
              aria-hidden="true"
            />

            Detener cámara
          </Button>
        )}

        <label
          className={styles.fileButton}
        >
          <ImageUp
            size={18}
            aria-hidden="true"
          />

          Leer imagen

          <input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={procesando}
            onChange={leerImagen}
          />
        </label>
      </div>

      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}

      {!window.isSecureContext && (
        <p className={styles.warning}>
          La cámara directa requiere
          localhost o HTTPS. La lectura desde
          imagen y el pegado manual siguen
          disponibles.
        </p>
      )}
    </section>
  );
}

export default QrScanner;
