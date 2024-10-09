const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
const db = new sqlite3.Database('./atenciones.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS atenciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rut TEXT,
  nombre TEXT,
  comuna TEXT,
  tipoSubsidio TEXT,
  comentario TEXT,
  horaInicio TEXT,
  horaFin TEXT,
  duracion INTEGER
)`);

// Ruta para obtener todas las atenciones
app.get('/atenciones', (req, res) => {
  db.all("SELECT * FROM atenciones", [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

// Ruta para crear una nueva atención
app.post('/atenciones', (req, res) => {
  const { rut, nombre, comuna, tipoSubsidio, comentario, horaInicio, horaFin, duracion } = req.body;
  db.run(`INSERT INTO atenciones (rut, nombre, comuna, tipoSubsidio, comentario, horaInicio, horaFin, duracion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [rut, nombre, comuna, tipoSubsidio, comentario, horaInicio, horaFin, duracion],
    function(err) {
      if (err) {
        res.status(400).json({"error": err.message})
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID }
      })
    });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});