const Cliente = require('../../models/Cliente.model')

const getClientes = async () => {
  return await Cliente.find({ estado: 'activo' })
}

const getClienteById = async (id) => {
  const cliente = await Cliente.findById(id)
  if (!cliente) {
    const err = new Error('Cliente no encontrado')
    err.status = 404
    throw err
  }
  return cliente
}

module.exports = { getClientes, getClienteById }