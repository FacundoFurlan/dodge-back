// Importar dependencias
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear la aplicación de Express
const app = express();

// Middleware para parsear el body de las peticiones como JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a la base de datos MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor en funcionamiento!");
});

// Ruta para obtener las puntuaciones (por ejemplo)
app.get("/top", (req, res) => {
  // Aquí iría la lógica para obtener el top 3 desde la base de datos
  res.json({ message: "Top 3 puntuaciones" });
});

// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});