const categoriaService = require('./categoria.service');
const { success, error } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const getCategorias = asyncHandler(async (req, res) => {
  const categorias = await categoriaService.findAll();
  return success(res, 200, categorias);
});

const getCategoriaById = asyncHandler(async (req, res) => {
  const categoria = await categoriaService.findById(req.params.id);
  if (!categoria) {
    return error(res, 404, 'Categoría no encontrada');
  }
  return success(res, 200, categoria);
});

const createCategoria = asyncHandler(async (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return error(res, 400, 'El nombre de la categoría es obligatorio');
  }

  const nuevaCategoria = await categoriaService.create(req.body);
  return success(res, 201, nuevaCategoria, 'Categoría creada correctamente');
});

const updateCategoria = asyncHandler(async (req, res) => {
  const categoriaActualizada = await categoriaService.update(req.params.id, req.body);

  if (!categoriaActualizada) {
    return error(res, 404, 'Categoría no encontrada');
  }

  return success(res, 200, categoriaActualizada, 'Categoría actualizada correctamente');
});

const deleteCategoria = asyncHandler(async (req, res) => {
  const categoria = await categoriaService.remove(req.params.id);

  if (!categoria) {
    return error(res, 404, 'Categoría no encontrada');
  }

  return success(res, 200, null, 'Categoría eliminada correctamente');
});

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};