const ROLES = {
  ADMIN: 'admin',
}

const verifyRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      })
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      })
    }

    next()
  }
}

module.exports = { verifyRole, ROLES }