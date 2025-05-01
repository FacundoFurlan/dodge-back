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
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a la base de datos MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Define el modelo para los puntajes
const Score = mongoose.model("Score", new mongoose.Schema({
    name: String,
    score: Number,
  }));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor en funcionamiento!");
});

// Ruta para obtener las puntuaciones (por ejemplo)
app.get("/api/scores", async (req, res) => {
    try {
      const topScores = await Score.find().sort({ score: -1 }).limit(3);
      console.log(topScores);
      res.send("se encontro algo").status(200).json(topScores);
    } catch (err) {
      res.status(500).send("Error al obtener puntajes.");
    }
  });
// Ruta POST para agregar un nuevo puntaje
app.post("/api/scores", async (req, res) => {
    const { name, score } = req.body;
  
    try {
      // Obtiene los top 3 puntajes más altos
      const topScores = await Score.find().sort({ score: -1 }).limit(3);
  
      // Si el puntaje es mayor que el más bajo de los 3 mejores, reemplaza uno de ellos
      if (topScores.length < 3 || score > topScores[2].score) {
        // Si el puntaje es nuevo, o más alto que el puntaje más bajo de los top 3
        // Guardamos el nuevo puntaje
        const newScore = new Score({ name, score });
        await newScore.save();
  
        // Elimina el puntaje más bajo si ya tenemos 3 puntajes en la base de datos
        if (topScores.length === 3) {
          await Score.deleteOne({ _id: topScores[2]._id }); // Elimina el puntaje más bajo
        }
  
        res.status(200).send("Puntaje actualizado correctamente.");
      } else {
        res.status(200).send("El puntaje no es suficiente para estar en el top 3.");
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