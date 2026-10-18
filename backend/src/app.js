const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db');
const librosRoutes = require('./routes/libros.routes');

const app = express();

app.use(cors());
app.use(express.json());   // permite recibir JSON en las peticiones
app.use(morgan('dev'));    // registra cada petición en la consola (logs)

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

// Rutas del CRUD
app.use('/api/libros', librosRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  const status = err.status || 500;
  if (status >= 500) {
    console.error('Error interno:', err);
  } else {
    console.warn(`Aviso ${status}: ${err.message}`);
  }

  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
});

module.exports = app;