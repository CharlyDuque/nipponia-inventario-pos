const express = require("express");
const cors = require("cors");
const swaggerUi = require(
  "swagger-ui-express"
);

const productosRoutes = require(
  "./routes/productos"
);

const ventasRoutes = require(
  "./routes/ventas"
);

const especificacionSwagger = require(
  "./config/swagger"
);

const app = express();

const operadorRoutes = require(
  "./routes/operador"
);
app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    especificacionSwagger,
    {
      explorer: true,

      customSiteTitle:
        "Nipponia API | Documentación",

      swaggerOptions: {
        displayRequestDuration: true,
      },
    }
  )
);

app.get("/", (req, res) => {
  res.send(
    "🚀 Nipponia API funcionando correctamente"
  );
});

app.use(
  "/api/productos",
  productosRoutes
);

app.use(
  "/api/ventas",
  ventasRoutes
);

app.use(
  "/api/operador",
  operadorRoutes
);
module.exports = {
  app,
};