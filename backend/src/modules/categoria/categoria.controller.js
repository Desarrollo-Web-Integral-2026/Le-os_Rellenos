const Categoria = require('../../models/Categoria.model');
const { success, error } = require('../../utils/response');

// GET /api/categorias
async function getCategorias(req, res) {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  return success(res, 200, categorias);
}

// GET /api/categorias/:id
async function getCategoriaById(req, res) {
  const categoria = await Categoria.findById(req.params.id);
  if (!categoria) {
    return error(res, 404, 'Categoría no encontrada');
  }
  return success(res, 200, categoria);
}

// POST /api/categorias
async function createCategoria(req, res) {
  const { nombre, descripcion } = req.body;

  if (!nombre || nombre.trim() === '') {
    return error(res, 400, 'El nombre de la categoría es obligatorio');
  }

  const nuevaCategoria = await Categoria.create({ nombre, descripcion });
  return success(res, 201, nuevaCategoria, 'Categoría creada correctamente');
}

// PUT /api/categorias/:id
async function updateCategoria(req, res) {
  const { nombre, descripcion } = req.body;

  const categoriaActualizada = await Categoria.findByIdAndUpdate(
    req.params.id,
    { nombre, descripcion },
    { new: true, runValidators: true }
  );

  if (!categoriaActualizada) {
    return error(res, 404, 'Categoría no encontrada');
  }

  return success(res, 200, categoriaActualizada, 'Categoría actualizada correctamente');
}

// DELETE /api/categorias/:id
async function deleteCategoria(req, res) {
  const categoria = await Categoria.findByIdAndDelete(req.params.id);

  if (!categoria) {
    return error(res, 404, 'Categoría no encontrada');
  }

  return success(res, 200, null, 'Categoría eliminada correctamente');
}

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};