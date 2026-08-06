const mongoose = require('mongoose')

const solicitudArcoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['acceso', 'rectificacion', 'cancelacion', 'oposicion'],
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    default: null,
  },
  datosSolicitados: {
    type: Object,
    default: null,
  },
  motivo: {
    type: String,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'resuelta', 'rechazada'],
    default: 'pendiente',
  },
  resultado: {
    type: String,
    default: null,
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now,
  },
  fechaResolucion: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

module.exports = mongoose.model('SolicitudArco', solicitudArcoSchema)