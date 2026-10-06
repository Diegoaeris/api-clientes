// Servidor principal de la API
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
app.use(express.json()); // permite leer JSON en el body

// Ruta de prueba: verifica que la API y la base de datos funcionan
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ mensaje: 'API funcionando', baseDeDatos: 'conectada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo conectar a la base de datos' });
  }
});

// Rutas del CRUD de clientes
app.use('/api/clientes', clienteRoutes);

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales (por ejemplo, JSON mal formado)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado está mal formado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});