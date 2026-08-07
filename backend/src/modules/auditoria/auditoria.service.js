const AuditLog = require('../../models/AuditLog.model')

const getLogs = async (filtros = {}) => {
  const query = {}

  if (filtros.usuarioId) query.usuarioId = filtros.usuarioId
  if (filtros.recurso) query.recurso = filtros.recurso
  if (filtros.accion) query.accion = filtros.accion
  if (filtros.desde || filtros.hasta) {
    query.fecha = {}
    if (filtros.desde) query.fecha.$gte = new Date(filtros.desde)
    if (filtros.hasta) query.fecha.$lte = new Date(filtros.hasta)
  }

  return await AuditLog.find(query).sort({ fecha: -1 })
}

module.exports = { getLogs }