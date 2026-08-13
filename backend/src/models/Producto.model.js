const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    imagen: {
      type: String,
      trim: true,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Si el stock llega a 0, el producto se marca automáticamente como no disponible
productoSchema.pre('validate', function (next) {
  if (this.stock <= 0) {
    this.disponible = false;
  }
});

module.exports = mongoose.model('Producto', productoSchema);