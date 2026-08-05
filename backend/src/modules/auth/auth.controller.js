const authService = require('./auth.service')

const login = async (req, res) => {
  try {
    const { correo, password } = req.body

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios',
      })
    }

    const result = await authService.login({ correo, password })
    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: result,
    })
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = { login }