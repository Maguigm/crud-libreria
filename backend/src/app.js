const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());   // permite recibir JSON en las peticiones
app.use(morgan('dev'));    // muestra cada petición en la consola (logs)

// Verifica que el servidor y la base de datos funcionan
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'conectada' });
  } catch (error) {
    console.error('Error de conexión a la BD:', error.message);
    res.status(503).json({ status: 'error', db: 'sin conexión' });
  }
});

module.exports = app;