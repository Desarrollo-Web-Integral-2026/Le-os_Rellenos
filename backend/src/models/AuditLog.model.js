const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null, // null si fue el cliente público (sin login)
  },
  usuarioTipo: {
    type: String,
    enum: ['admin', 'publico'],
    required: true,
  },
  accion: {
    type: String,
    required: true, // ej. 'LECTURA', 'RESOLUCION', 'ANONIMIZACION'
  },
  recurso: {
    type: String,
    required: true, // ej. 'Cliente', 'SolicitudArco'
  },
  recursoId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null, // referencia al documento afectado — NUNCA el dato personal en sí
  },
  finalidad: {
    type: String,
    required: true,
  },
  ip: {
    type: String, // se guarda hasheada, nunca en texto plano
    default: null,
  },
  resultado: {
    type: String,
    enum: ['exitoso', 'fallido'],
    default: 'exitoso',
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

auditLogSchema.index({ fecha: -1 })
auditLogSchema.index({ usuarioId: 1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)