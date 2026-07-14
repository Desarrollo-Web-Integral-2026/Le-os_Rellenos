const mongoose = require('mongoose');

const detallePedidoSchema = new mongoose.Schema(
  {
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: true,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DetallePedido', detallePedidoSchema);