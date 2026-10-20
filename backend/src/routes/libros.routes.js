const express = require('express');
const librosService = require('../services/librosService');

const router = express.Router();



//enlistar todos los libro
router.get('/', async (req, res, next) => {
  try {
    const libros = await librosService.listar(req.query.q, req.query.campo);
    res.json(libros);
  } catch (error) {
    next(error);
  }
});

//obtener por id
router.get('/:id', async (req, res, next) => {
  try {
    const libro = await librosService.obtener(req.params.id);
    res.json(libro);
  } catch (error) {
    next(error);
  }
});

// crea libro 
router.post('/', async (req, res, next) => {
  try {
    const libro = await librosService.crear(req.body);
    res.status(201).json(libro);
  } catch (error) {
    next(error);
  }
});

//edita libro
router.put('/:id', async (req, res, next) => {
  try {
    const libro = await librosService.actualizar(req.params.id, req.body);
    res.json(libro);
  } catch (error) {
    next(error);
  }
});

//elimina libro
router.delete('/:id', async (req, res, next) => {
  try {
    await librosService.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;