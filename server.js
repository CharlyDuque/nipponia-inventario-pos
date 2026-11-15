require("dotenv").config();
const conectarDB = require("./src/config/db");
const { app } = require("./src/app");

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
 
  await conectarDB();
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

iniciarServidor();