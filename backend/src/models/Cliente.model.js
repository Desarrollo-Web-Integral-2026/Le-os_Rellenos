const mongoose = require('mongoose');

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

    // --- Campos para minimización y ciclo de vida (RNF8) ---
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
);

clienteSchema.index({ estado: 1, fechaRegistro: 1 });

module.exports = mongoose.model('Cliente', clienteSchema);