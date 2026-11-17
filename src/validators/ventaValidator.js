const { z } = require("zod");

const itemVentaSchema = z
  .object({
    productoId: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "El identificador del producto no es válido"
      ),

    cantidad: z
      .number()
      .int("La cantidad debe ser un número entero")
      .positive("La cantidad debe ser mayor que cero"),
  })
  .strict();

const crearVentaSchema = z
  .object({
    pedidoId: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "El identificador del pedido no es válido"
      )
      .optional(),

    productos: z
      .array(itemVentaSchema)
      .min(
        1,
        "El carrito debe contener al menos un producto"
      ),

    metodoPago: z.enum(
      [
        "Efectivo",
        "Transferencia",
      ]
    ),

    efectivoRecibido: z
      .number()
      .finite()
      .nonnegative()
      .optional(),
  })
const cancelarVentaSchema = z
  .object({
    motivo: z
      .string()
      .trim()
      .min(
        3,
        "El motivo debe tener al menos 3 caracteres"
      )
      .max(
        300,
        "El motivo no puede exceder 300 caracteres"
      ),
  })
  .strict();
module.exports = {
  crearVentaSchema,
  cancelarVentaSchema,
};