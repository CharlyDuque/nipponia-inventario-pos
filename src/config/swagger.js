const swaggerJsdoc = require("swagger-jsdoc");

const opcionesSwagger = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Nipponia API",
      version: "1.0.0",
      description:
        "API REST para administrar productos, inventario, ventas y cortes de caja de Nipponia.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
      },
    ],

    tags: [
      {
        name: "Sistema",
        description: "Estado general del servidor",
      },
      {
        name: "Productos",
        description:
          "Inventario, consulta, actualización, baja lógica y reactivación de productos",
      },
      {
        name: "Ventas",
        description:
          "Registro, historial, cancelación y corte de caja",
      },
    ],

    components: {
      schemas: {
        Producto: {
          type: "object",

          properties: {
            _id: {
              type: "string",
              example: "6af93c20b70e915a93752cc8",
            },

            codigo: {
              type: "string",
              example: "MNG003",
            },

            nombre: {
              type: "string",
              example: "Dragon Ball Vol. 1",
            },

            descripcion: {
              type: "string",
              example:
                "Primer volumen del manga Dragon Ball",
            },

            categoria: {
              type: "string",
              example: "Manga",
            },

            precio: {
              type: "number",
              format: "double",
              example: 220,
            },

            stock: {
              type: "integer",
              minimum: 0,
              example: 7,
            },

            imagen: {
              type: "string",
              example: "",
            },

            activo: {
              type: "boolean",
              example: true,
            },

            fechaBaja: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: null,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CrearProducto: {
          type: "object",

          required: [
            "codigo",
            "nombre",
            "categoria",
            "precio",
            "stock",
          ],

          additionalProperties: false,

          properties: {
            codigo: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              example: "MNG004",
            },

            nombre: {
              type: "string",
              minLength: 2,
              maxLength: 150,
              example: "Sailor Moon Vol. 1",
            },

            descripcion: {
              type: "string",
              maxLength: 1000,
              example:
                "Producto agregado desde Swagger",
            },

            categoria: {
              type: "string",
              maxLength: 60,
              example: "Manga",
            },

            precio: {
              type: "number",
              minimum: 0,
              example: 190,
            },

            stock: {
              type: "integer",
              minimum: 0,
              example: 5,
            },

            imagen: {
              type: "string",
              maxLength: 500,
              example: "",
            },
          },
        },

        ActualizarProducto: {
          type: "object",
          minProperties: 1,
          additionalProperties: false,

          properties: {
            codigo: {
              type: "string",
              example: "MNG004",
            },

            nombre: {
              type: "string",
              example: "Sailor Moon Vol. 1",
            },

            descripcion: {
              type: "string",
              example: "Descripción actualizada",
            },

            categoria: {
              type: "string",
              example: "Manga",
            },

            precio: {
              type: "number",
              minimum: 0,
              example: 195,
            },

            stock: {
              type: "integer",
              minimum: 0,
              example: 8,
            },

            imagen: {
              type: "string",
              example: "",
            },
          },
        },

        ItemVentaEntrada: {
          type: "object",

          required: [
            "productoId",
            "cantidad",
          ],

          additionalProperties: false,

          properties: {
            productoId: {
              type: "string",
              example: "6af93c20b70e915a93752cc8",
            },

            cantidad: {
              type: "integer",
              minimum: 1,
              example: 2,
            },
          },
        },

        CrearVenta: {
          type: "object",

          required: [
            "productos",
            "metodoPago",
          ],

          additionalProperties: false,

          properties: {
            productos: {
              type: "array",
              minItems: 1,

              items: {
                $ref: "#/components/schemas/ItemVentaEntrada",
              },
            },

            metodoPago: {
              type: "string",
              enum: [
                "Efectivo",
                "Transferencia",
              ],
              example: "Efectivo",
            },

            efectivoRecibido: {
              type: "number",
              minimum: 0,
              example: 500,
              description:
                "Obligatorio cuando el método de pago es Efectivo",
            },
          },
        },

        ItemVenta: {
          type: "object",

          properties: {
            productoId: {
              type: "string",
            },

            codigo: {
              type: "string",
              example: "MNG003",
            },

            nombre: {
              type: "string",
              example: "Dragon Ball Vol. 1",
            },

            cantidad: {
              type: "integer",
              example: 2,
            },

            precioUnitario: {
              type: "number",
              example: 220,
            },

            subtotal: {
              type: "number",
              example: 440,
            },
          },
        },

        Venta: {
          type: "object",

          properties: {
            _id: {
              type: "string",
              example: "6af950024a7689468804a9f2",
            },

            folio: {
              type: "string",
              example: "NIP-20261115062402-6797",
            },

            productos: {
              type: "array",

              items: {
                $ref: "#/components/schemas/ItemVenta",
              },
            },

            total: {
              type: "number",
              example: 440,
            },

            metodoPago: {
              type: "string",
              enum: [
                "Efectivo",
                "Transferencia",
              ],
            },

            efectivoRecibido: {
              type: "number",
              nullable: true,
              example: 500,
            },

            cambio: {
              type: "number",
              example: 60,
            },

            estado: {
              type: "string",
              enum: [
                "Completada",
                "Cancelada",
              ],
              example: "Completada",
            },

            fechaCancelacion: {
              type: "string",
              format: "date-time",
              nullable: true,
            },

            motivoCancelacion: {
              type: "string",
              nullable: true,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CancelarVenta: {
          type: "object",
          required: ["motivo"],
          additionalProperties: false,

          properties: {
            motivo: {
              type: "string",
              minLength: 3,
              maxLength: 300,
              example:
                "El cliente solicitó cancelar la compra",
            },
          },
        },

        Error: {
          type: "object",

          properties: {
            mensaje: {
              type: "string",
              example: "Datos de entrada inválidos",
            },

            errores: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  campo: {
                    type: "string",
                    example: "precio",
                  },

                  mensaje: {
                    type: "string",
                    example:
                      "El precio no puede ser negativo",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.js",
  ],
};

const especificacionSwagger =
  swaggerJsdoc(opcionesSwagger);

module.exports = especificacionSwagger;