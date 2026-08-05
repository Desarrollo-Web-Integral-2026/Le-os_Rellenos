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

module.exports = { getClientes, getClienteById }