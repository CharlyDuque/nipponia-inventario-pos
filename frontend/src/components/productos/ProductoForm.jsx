import {
  useEffect,
  useState,
} from "react";

import Button from "../Button/Button";
import Input from "../Input/Input";

import styles from "./ProductoForm.module.css";

const initialValues = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  stock: "",
  imagen: "",
};

function ProductoForm({
  producto = null,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] =
    useState(initialValues);

  const [errors, setErrors] =
    useState({});

  const [
    generalError,
    setGeneralError,
  ] = useState("");

  const [saving, setSaving] =
    useState(false);

  const editing = Boolean(producto);

  useEffect(() => {
    if (producto) {
      setValues({
        codigo:
          producto.codigo || "",

        nombre:
          producto.nombre || "",

        descripcion:
          producto.descripcion || "",

        categoria:
          producto.categoria || "",

        precio:
          producto.precio !==
          undefined
            ? String(producto.precio)
            : "",

        stock:
          producto.stock !==
          undefined
            ? String(producto.stock)
            : "",

        imagen:
          producto.imagen || "",
      });
    } else {
      setValues(initialValues);
    }

    setErrors({});
    setGeneralError("");
  }, [producto]);

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setValues((current) => ({
      ...current,
 [name]: value
      // La clave debe ser el nombre del campo.
      
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setGeneralError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErrors({});
    setGeneralError("");

    const payload = {
      codigo:
        values.codigo.trim(),

      nombre:
        values.nombre.trim(),

      descripcion:
        values.descripcion.trim(),

      categoria:
        values.categoria.trim(),

      precio:
        Number(values.precio),

      stock:
        Number(values.stock),

      imagen:
        values.imagen.trim(),
    };

    try {
      await onSubmit(payload);
    } catch (requestError) {
      const fieldErrors = {};

      requestError.detalles?.forEach(
        ({
          campo,
          mensaje,
        }) => {
          if (campo === "body") {
            setGeneralError(mensaje);
          } else {
            fieldErrors[campo] =
              mensaje;
          }
        }
      );

      setErrors(fieldErrors);

      if (
        !requestError.detalles?.length
      ) {
        setGeneralError(
          requestError.message ||
            "No fue posible guardar el producto"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {generalError && (
        <div
          className={styles.generalError}
          role="alert"
        >
          {generalError}
        </div>
      )}

      <div className={styles.columns}>
        <Input
          id="codigo"
          name="codigo"
          label="Código"
          value={values.codigo}
          onChange={handleChange}
          error={errors.codigo}
          placeholder="MNG004"
          autoComplete="off"
          required
        />

        <Input
          id="categoria"
          name="categoria"
          label="Categoría"
          value={values.categoria}
          onChange={handleChange}
          error={errors.categoria}
          placeholder="Manga"
          autoComplete="off"
          required
        />
      </div>

      <Input
        id="nombre"
        name="nombre"
        label="Nombre"
        value={values.nombre}
        onChange={handleChange}
        error={errors.nombre}
        placeholder="Sailor Moon Vol. 1"
        autoComplete="off"
        required
      />

      <div className={styles.field}>
        <label
          htmlFor="descripcion"
          className={styles.label}
        >
          Descripción
        </label>

        <textarea
          id="descripcion"
          name="descripcion"
          className={`${styles.textarea} ${
            errors.descripcion
              ? styles.invalid
              : ""
          }`}
          value={values.descripcion}
          onChange={handleChange}
          rows="4"
          placeholder="Descripción para el catálogo"
          aria-invalid={Boolean(
            errors.descripcion
          )}
          aria-describedby={
            errors.descripcion
              ? "descripcion-error"
              : undefined
          }
        />

        {errors.descripcion && (
          <span
            id="descripcion-error"
            className={styles.error}
            role="alert"
          >
            {errors.descripcion}
          </span>
        )}
      </div>

      <div className={styles.columns}>
        <Input
          id="precio"
          name="precio"
          type="number"
          label="Precio"
          value={values.precio}
          onChange={handleChange}
          error={errors.precio}
          placeholder="195"
          min="0"
          step="0.01"
          inputMode="decimal"
          required
        />

        <Input
          id="stock"
          name="stock"
          type="number"
          label="Stock"
          value={values.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="4"
          min="0"
          step="1"
          inputMode="numeric"
          required
        />
      </div>

      <Input
        id="imagen"
        name="imagen"
        label="Ruta de imagen"
        value={values.imagen}
        onChange={handleChange}
        error={errors.imagen}
        placeholder="/images/producto.jpg"
        helpText="Opcional por ahora"
        autoComplete="off"
      />

      <footer className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={saving}
        >
          {saving
            ? "Guardando…"
            : editing
              ? "Guardar cambios"
              : "Crear producto"}
        </Button>
      </footer>
    </form>
  );
}

export default ProductoForm;