const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    })
  }
}

module.exports = { verifyToken }