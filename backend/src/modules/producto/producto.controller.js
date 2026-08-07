const productoService = require('./producto.service');
const { success, error } = require('../../utils/response');

// GET /api/productos
async function getProductos(req, res) {
  const productos = await productoService.findAll(req.query);
  return success(res, 200, productos);
}

// GET /api/productos/:id
async function getProductoById(req, res) {
  const producto = await productoService.findById(req.params.id);

  if (!producto) {
    return error(res, 404, 'Producto no encontrado');
  }

  return success(res, 200, producto);
}

// POST /api/productos
async function createProducto(req, res) {
  const { nombre, precio, categoria } = req.body;

  if (!nombre || precio === undefined || !categoria) {
    return error(res, 400, 'Los campos nombre, precio y categoria son obligatorios');
  }

  if (precio < 0) {
    return error(res, 400, 'El precio no puede ser negativo');
  }

  const existeCategoria = await productoService.categoriaExiste(categoria);
  if (!existeCategoria) {
    return error(res, 400, 'La categoría especificada no existe');
  }

  const nuevoProducto = await productoService.create(req.body);
  return success(res, 201, nuevoProducto, 'Producto creado correctamente');
}

// PUT /api/productos/:id
async function updateProducto(req, res) {
  const { precio, categoria } = req.body;

  if (precio !== undefined && precio < 0) {
    return error(res, 400, 'El precio no puede ser negativo');
  }

  if (categoria) {
    const existeCategoria = await productoService.categoriaExiste(categoria);
    if (!existeCategoria) {
      return error(res, 400, 'La categoría especificada no existe');
    }
  }

  const productoActualizado = await productoService.update(req.params.id, req.body);

  if (!productoActualizado) {
    return error(res, 404, 'Producto no encontrado');
  }

  return success(res, 200, productoActualizado, 'Producto actualizado correctamente');
}

// DELETE /api/productos/:id
async function deleteProducto(req, res) {
  const producto = await productoService.remove(req.params.id);

  if (!producto) {
    return error(res, 404, 'Producto no encontrado');
  }

  return success(res, 200, null, 'Producto eliminado correctamente');
}

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};