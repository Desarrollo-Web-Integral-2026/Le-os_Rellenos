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

// Busca por telefono en memoria (por el cifrado con IV aleatorio)
const buscarClientePorTelefono = async (telefono) => {
  const clientes = await Cliente.find()
  return clientes.find((c) => c.telefono === telefono) || null
}

// Crear al cliente si no existe, o regresa el existente si el telefono ya esta registrado
const creaetOrFindCliente = async ({ nombre, telefono, ubicacion }) => {
  const existente = await buscarClientePorTelefono(telefono)

  if(existente) {
    return { cliente: existente, creado: false }
  }

  const cliente = new Cliente({
    nombre,
    telefono,
    ubicacion,
    finalidad: 'pedido',
  })
  await cliente.save()

  return { cliente, creado: true }
}

module.exports = { getClientes, getClienteById, buscarClientePorTelefono, creaetOrFindCliente }