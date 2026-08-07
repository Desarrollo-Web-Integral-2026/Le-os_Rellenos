const auditoriaService = require('./auditoria.service')

const getLogs = async (req, res) => {
  try {
    const { usuarioId, recurso, accion, desde, hasta } = req.query
    const logs = await auditoriaService.getLogs({ usuarioId, recurso, accion, desde, hasta })
    return res.status(200).json({ success: true, data: logs })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

module.exports = { getLogs }