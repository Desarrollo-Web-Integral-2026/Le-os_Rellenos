const crypto = require('crypto')
const AuditLog = require('../models/AuditLog.model')

// Criterio 2 — la IP se hashea, nunca se guarda en texto plano
const hashIp = (ip) => {
  if (!ip) return null
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// Criterio 1 — registra quién, cuándo y para qué
const auditLog = (accion, recurso, finalidad) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res)

    // Se engancha a la respuesta real, para registrar el resultado verdadero (éxito/fallo)
    res.json = (body) => {
      const resultado = res.statusCode >= 200 && res.statusCode < 400 ? 'exitoso' : 'fallido'

      let recursoId = req.params.id || null
      if (!recursoId && body?.data?._id) recursoId = body.data._id

      AuditLog.create({
        usuarioId: req.user?.id || null,
        usuarioTipo: req.user ? 'admin' : 'publico',
        accion,
        recurso,
        recursoId,
        finalidad,
        ip: hashIp(req.ip),
        resultado,
      }).catch((err) => {
        // No debe romper la respuesta al cliente si falla el log
        console.error('[AuditLog] Error al registrar bitácora:', err.message)
      })

      return originalJson(body)
    }

    next()
  }
}

module.exports = { auditLog }