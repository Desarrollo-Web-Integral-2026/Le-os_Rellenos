const clientesService = require('./clientes.service')

const getClientes = async (req, res) => {
  try {
    const clientes = await clientesService.getClientes()
    return res.status(200).json({
      success: true,
      message: 'Clientes obtenidos correctamente',
      data: clientes,
    })
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const getClienteById = async (req, res) => {
  try {
    const cliente = await clientesService.getClienteById(req.params.id)
    return res.status(200).json({
      success: true,
      data: cliente,
    })
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, ubicacion } = req.body

    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({ success: false, message: 'Nombre es obligatorio y debe ser texto'})
    }
    if (!telefono || typeof telefono !== 'string') {
      return res.status(400).json({ success: false, message: 'Telefono obligatorioy debe ser texto'})
    }

    const { cliente, creado } = await clientesService.creaetOrFindCliente({ nombre, telefono, ubicacion })

    return res.status(creado ? 201 : 200).json({
      success: true,
      message: creado ? 'Cliente registrado correctamente' : 'Cliente ya existente, se reutiliza el registro',
      data: { id: cliente._id, telefono: cliente.telefono },
    })
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = { getClientes, getClienteById, createCliente }