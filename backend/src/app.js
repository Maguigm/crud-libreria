const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');      
const openapi = require('./docs/openapi');             
const pool = require('./db');
const librosRoutes = require('./routes/libros.routes');

const app = express();

app.use(cors());
app.use(express.json());   

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'API CRUD Librería' }));
app.get('/api-docs.json', (req, res) => res.json(openapi));


app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'conectada' });
  } catch (error) {
    console.error('Error de conexión a la BD:', error.message);
    res.status(503).json({ status: 'error', db: 'sin conexión' });
  }
});


app.use('/api/libros', librosRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


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