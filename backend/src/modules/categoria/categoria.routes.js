const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require('./categoria.controller');

router.get('/listar', getCategorias);
router.get('/listar/:id', getCategoriaById);
router.post('/crear', createCategoria);
router.put('/actualizar/:id', updateCategoria);
router.delete('/eliminar/:id', deleteCategoria);

module.exports = router;