const { z } = require("zod");

const itemPedidoSchema = z
  .object({
    productoId: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "El identificador del producto no es válido"
      ),

    cantidad: z
      .number()
      .int(
        "La cantidad debe ser un número entero"
      )
      .positive(
        "La cantidad debe ser mayor que cero"
      ),
  })
  .strict();

const crearPedidoSchema = z
  .object({
    productos: z
      .array(itemPedidoSchema)
      .min(
        1,
        "El pedido debe contener al menos un producto"
      ),
  })
  .strict()
  .superRefine((datos, ctx) => {
    const ids = datos.productos.map(
      (item) => item.productoId
    );

    if (
      new Set(ids).size !== ids.length
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["productos"],
        message:
          "Un producto no puede aparecer repetido",
      });
    }
  });

module.exports = {
  crearPedidoSchema,
};
