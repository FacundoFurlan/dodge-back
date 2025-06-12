// Importar dependencias
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear la aplicación de Express
const app = express();

// Middleware para parsear el body de las peticiones como JSON
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a la base de datos MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Define el modelo para los puntajes
const Score = mongoose.model(
    "Score",
    new mongoose.Schema({
      name: String,
      score: Number,
      lvl: Number
    }),
    "top" //Esto le dice a Mongoose que use la colección "top"
  );

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor en funcionamiento!");
});

// Ruta para obtener las puntuaciones (por ejemplo)
app.get("/api/scores", async (req, res) => {
    try {
      const topScores = await Score.find().sort({ score: -1 }).limit(3);
      console.log(topScores);
      res.status(200).json(topScores);
    } catch (err) {
      res.status(500).send("Error al obtener puntajes.");
    }
  });
// Ruta POST para agregar un nuevo puntaje
app.post("/api/scores", async (req, res) => {
    const { name, score, lvl } = req.body;
  
    try {
      // Obtiene los top 3 puntajes más altos
      const topScores = await Score.find().sort({ score: -1 }).limit(3);
  
      // Si el puntaje es mayor que el más bajo de los 3 mejores, reemplaza uno de ellos
      if (topScores.length < 3 || score > topScores[2].score) {
        // Si el puntaje es nuevo, o más alto que el puntaje más bajo de los top 3
        // Guardamos el nuevo puntaje
        const newScore = new Score({ name, score, lvl });
        await newScore.save();
  
        res.status(200).send("New Top!!!");
      } else {
        res.status(200).send("Not Enough Points!");
      }
    } catch (err) {
      console.log("Error procesando puntaje:", err);
      res.status(500).send("Error procesando la solicitud.");
    }
  });
// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});