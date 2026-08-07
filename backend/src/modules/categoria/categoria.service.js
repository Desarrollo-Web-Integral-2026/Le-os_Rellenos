const Categoria = require('../../models/Categoria.model');

async function findAll() {
  return Categoria.find().sort({ nombre: 1 });
}

async function findById(id) {
  return Categoria.findById(id);
}

async function create(data) {
  const { nombre, descripcion } = data;
  return Categoria.create({ nombre, descripcion });
}

async function update(id, data) {
  const { nombre, descripcion } = data;
  return Categoria.findByIdAndUpdate(
    id,
    { nombre, descripcion },
    { new: true, runValidators: true }
  );
}

async function remove(id) {
  return Categoria.findByIdAndDelete(id);
}

module.exports = { findAll, findById, create, update, remove };