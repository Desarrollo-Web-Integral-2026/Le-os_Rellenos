const arcoService = require('./arco.service')

const crearSolicitud = async (req, res) => {
  try {
    const { tipo, telefono, datosSolicitados, motivo } = req.body

    if (!tipo || !telefono || typeof telefono !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'tipo y telefono son obligatorios y deben ser texto',
      })
    }

    const solicitud = await arcoService.crearSolicitud({ tipo, telefono, datosSolicitados, motivo })
    return res.status(201).json({
      success: true,
      message: 'Solicitud ARCO registrada, será revisada por el administrador',
      data: solicitud,
    })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await arcoService.getSolicitudes()
    return res.status(200).json({ success: true, data: solicitudes })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

const resolverSolicitud = async (req, res) => {
  try {
    const solicitud = await arcoService.resolverSolicitud(req.params.id)
    return res.status(200).json({ success: true, message: 'Solicitud resuelta', data: solicitud })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

const anonimizarCliente = async (req, res) => {
  try {
    const cliente = await arcoService.anonimizarCliente(req.params.id)
    return res.status(200).json({ success: true, message: 'Cliente anonimizado', data: cliente })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

module.exports = { crearSolicitud, getSolicitudes, resolverSolicitud, anonimizarCliente }