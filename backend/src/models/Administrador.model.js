const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 12 // Criterio 2 — cost factor >= 10

const administradorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// Criterio 1 — hashing automático con bcrypt antes de guardar
administradorSchema.pre('save', async function (next) {
  // Solo re-hashea si el password es nuevo o fue modificado
  // (evita re-hashear un hash que ya está hasheado)
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Método de instancia para comparar password en el login
administradorSchema.methods.compararPassword = async function (passwordPlano) {
  return await bcrypt.compare(passwordPlano, this.password)
}

module.exports = mongoose.model('Administrador', administradorSchema)