const Producto = require('../../models/Producto.model');
const Categoria = require('../../models/Categoria.model');

async function findAll(query) {
  const filtro = {};

  if (query.disponible !== undefined) {
    filtro.disponible = query.disponible === 'true';
  }

  if (query.categoria) {
    filtro.categoria = query.categoria;
  }

  return Producto.find(filtro)
    .populate('categoria', 'nombre descripcion')
    .sort({ createdAt: -1 });
}

async function findById(id) {
  return Producto.findById(id).populate('categoria', 'nombre descripcion');
}

async function categoriaExiste(categoriaId) {
  const categoria = await Categoria.findById(categoriaId);
  return !!categoria;
}

async function create(data) {
  const { nombre, descripcion, precio, imagen, categoria, disponible, stock } = data;

  const nuevoProducto = await Producto.create({
    nombre,
    descripcion,
    precio,
    imagen,
    categoria,
    disponible,
    stock,
  });

  return nuevoProducto.populate('categoria', 'nombre descripcion');
}

async function update(id, data) {
  const { nombre, descripcion, precio, imagen, categoria, disponible, stock } = data;

  return Producto.findByIdAndUpdate(
    id,
    { nombre, descripcion, precio, imagen, categoria, disponible, stock },
    { new: true, runValidators: true }
  ).populate('categoria', 'nombre descripcion');
}

async function remove(id) {
  return Producto.findByIdAndDelete(id);
}

module.exports = { findAll, findById, categoriaExiste, create, update, remove };