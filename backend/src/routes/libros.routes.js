const express = require('express');
const librosService = require('../services/librosService');

const router = express.Router();

// GET /api/libros            → lista todos
// GET /api/libros?q=texto    → busca en título, autor y género
// GET /api/libros?q=texto&campo=autor → busca solo en ese campo
router.get('/', async (req, res, next) => {
  try {
    const libros = await librosService.listar(req.query.q, req.query.campo);
    res.json(libros);
  } catch (error) {
    next(error);
  }
});

// GET /api/libros/:id → detalle de un libro
router.get('/:id', async (req, res, next) => {
  try {
    const libro = await librosService.obtener(req.params.id);
    res.json(libro);
  } catch (error) {
    next(error);
  }
});

// POST /api/libros → crea un libro (el ID se genera automáticamente)
router.post('/', async (req, res, next) => {
  try {
    const libro = await librosService.crear(req.body);
    res.status(201).json(libro);
  } catch (error) {
    next(error);
  }
});

// PUT /api/libros/:id → edita un libro (el ID no se puede cambiar)
router.put('/:id', async (req, res, next) => {
  try {
    const libro = await librosService.actualizar(req.params.id, req.body);
    res.json(libro);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/libros/:id → elimina un libro
router.delete('/:id', async (req, res, next) => {
  try {
    await librosService.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;