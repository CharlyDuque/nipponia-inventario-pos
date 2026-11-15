const { z } = require("zod");

// Campos obligatorios y opcionales para CREAR un producto
const crearProductoSchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .min(1, "El código no puede estar vacío")
      .max(50, "El código no puede exceder 50 caracteres"),

    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(150, "El nombre no puede exceder 150 caracteres"),

    descripcion: z
      .string()
      .trim()
      .max(1000, "La descripción no puede exceder 1000 caracteres")
      .optional()
      .default(""),

    categoria: z
      .string()
      .trim()
      .min(1, "La categoría no puede estar vacía")
      .max(60, "La categoría no puede exceder 60 caracteres"),

    precio: z
      .number()
      .finite("El precio debe ser un número finito")
      .nonnegative("El precio no puede ser negativo"),

    stock: z
      .number()
      .int("El stock debe ser un número entero")
      .nonnegative("El stock no puede ser negativo"),

    imagen: z
      .string()
      .trim()
      .max(500, "La ruta de imagen no puede exceder 500 caracteres")
      .optional()
      .default(""),
  })
  .strict();

// Esquema separado para ACTUALIZAR.
// No utiliza default(), para no sobrescribir campos omitidos.
const actualizarProductoSchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .min(1, "El código no puede estar vacío")
      .max(50, "El código no puede exceder 50 caracteres")
      .optional(),

    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(150, "El nombre no puede exceder 150 caracteres")
      .optional(),

    descripcion: z
      .string()
      .trim()
      .max(1000, "La descripción no puede exceder 1000 caracteres")
      .optional(),

    categoria: z
      .string()
      .trim()
      .min(1, "La categoría no puede estar vacía")
      .max(60, "La categoría no puede exceder 60 caracteres")
      .optional(),

    precio: z
      .number()
      .finite("El precio debe ser un número finito")
      .nonnegative("El precio no puede ser negativo")
      .optional(),

    stock: z
      .number()
      .int("El stock debe ser un número entero")
      .nonnegative("El stock no puede ser negativo")
      .optional(),

    imagen: z
      .string()
      .trim()
      .max(500, "La ruta de imagen no puede exceder 500 caracteres")
      .optional(),
  })
  .strict()
  .refine(
    (datos) => Object.keys(datos).length > 0,
    {
      message: "Debes proporcionar al menos un campo para actualizar",
    }
  );

module.exports = {
  crearProductoSchema,
  actualizarProductoSchema,
};