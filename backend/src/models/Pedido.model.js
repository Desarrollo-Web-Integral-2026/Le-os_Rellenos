const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    fechaPedido: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: ['nuevo', 'en_preparacion', 'en_camino', 'completado'],
      default: 'nuevo',
    },
    metodoEnvio: {
      type: String,
      trim: true,
    },
    observaciones: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pedido', pedidoSchema);