const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('./producto.controller');

router.get('/listar', getProductos);
router.get('/listar/:id', getProductoById);
router.post('/crear', createProducto);
router.put('/actualizar/:id', updateProducto);
router.delete('/eliminar/:id', deleteProducto);

module.exports = router;