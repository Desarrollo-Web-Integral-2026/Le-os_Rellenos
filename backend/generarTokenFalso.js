require('dotenv').config()
const jwt = require('jsonwebtoken')

const tokenFalso = jwt.sign(
  { id: '000000000000000000000000', nombre: 'Usuario Falso', rol: 'otro' },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
)

console.log(tokenFalso)