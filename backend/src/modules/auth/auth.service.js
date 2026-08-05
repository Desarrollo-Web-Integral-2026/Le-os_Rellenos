const jwt = require('jsonwebtoken')
const Administrador = require('../../models/Administrador.model')

const login = async ({ correo, password }) => {
  const admin = await Administrador.findOne({ correo })

  if (!admin) {
    const err = new Error('Credenciales incorrectas')
    err.status = 401
    throw err
  }

  const passwordValido = await admin.compararPassword(password)

  if (!passwordValido) {
    const err = new Error('Credenciales incorrectas')
    err.status = 401
    throw err
  }

  const token = jwt.sign(
    { id: admin._id, nombre: admin.nombre, rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return {
    token,
    admin: { id: admin._id, nombre: admin.nombre, rol: 'admin' },
  }
}

module.exports = { login }