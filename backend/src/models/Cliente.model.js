const mongoose = require('mongoose')
const { encryptField, decryptField } = require('../utils/encrypt')

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    ubicacion: {
      type: String,
      trim: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
    finalidad: {
      type: String,
      required: true,
      enum: ['pedido', 'contacto'],
      default: 'pedido',
    },
    diasRetencion: {
      type: Number,
      required: true,
      default: 365,
    },
    estado: {
      type: String,
      enum: ['activo', 'anonimizado'],
      default: 'activo',
    },
    fechaAnonimizacion: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

clienteSchema.index({ estado: 1, fechaRegistro: 1 })

// Criterio 1 — cifrar campos sensibles antes de guardar
clienteSchema.pre('save', async function () {
  if (this.isModified('nombre') && this.nombre) {
    this.nombre = encryptField(this.nombre)
  }
  if (this.isModified('telefono') && this.telefono) {
    this.telefono = encryptField(this.telefono)
  }
  if (this.isModified('ubicacion') && this.ubicacion) {
    this.ubicacion = encryptField(this.ubicacion)
  }
})

// Descifrar al leer
clienteSchema.post('find', function (docs) {
  docs.forEach((doc) => {
    try {
      if (doc.nombre) doc.nombre = decryptField(doc.nombre)
      if (doc.telefono) doc.telefono = decryptField(doc.telefono)
      if (doc.ubicacion) doc.ubicacion = decryptField(doc.ubicacion)
    } catch {
      // Si no se puede descifrar dejar el valor tal cual
    }
  })
})

clienteSchema.post('findOne', function (doc) {
  if (!doc) return
  try {
    if (doc.nombre) doc.nombre = decryptField(doc.nombre)
    if (doc.telefono) doc.telefono = decryptField(doc.telefono)
    if (doc.ubicacion) doc.ubicacion = decryptField(doc.ubicacion)
  } catch {
    // Si no se puede descifrar dejar el valor tal cual
  }
})

module.exports = mongoose.model('Cliente', clienteSchema)