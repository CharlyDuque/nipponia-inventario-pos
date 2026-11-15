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
    productos: z
      .array(itemVentaSchema)
      .min(1, "El carrito debe contener al menos un producto"),

    metodoPago: z.enum(
      ["Efectivo", "Transferencia"],
      {
        message:
          "El método de pago debe ser Efectivo o Transferencia",
      }
    ),

    efectivoRecibido: z
      .number()
      .finite("El efectivo recibido debe ser un número válido")
      .nonnegative(
        "El efectivo recibido no puede ser negativo"
      )
      .optional(),
  })
  .strict()
  .superRefine((datos, ctx) => {
    const identificadores = datos.productos.map(
      (item) => item.productoId
    );

    const identificadoresUnicos = new Set(identificadores);

    if (identificadoresUnicos.size !== identificadores.length) {
      ctx.addIssue({
        code: "custom",
        path: ["productos"],
        message:
          "Un producto no puede aparecer repetido en la venta",
      });
    }

    if (
      datos.metodoPago === "Efectivo" &&
      datos.efectivoRecibido === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["efectivoRecibido"],
        message:
          "El efectivo recibido es obligatorio para pagos en efectivo",
      });
    }
  });
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