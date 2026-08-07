const consentimientoService = require('./consentimiento.service')

const otorgar = async (req, res) => {
  try {
    const { telefono, finalidad } = req.body
    if (!telefono) {
      return res.status(400).json({ success: false, message: 'telefono es obligatorio' })
    }
    const cliente = await consentimientoService.otorgarConsentimiento({ telefono, finalidad })
    return res.status(200).json({
      success: true,
      message: 'Consentimiento registrado',
      data: {
        telefono: cliente.telefono,
        consentimientoTransferencia: cliente.consentimientoTransferencia,
        fechaConsentimiento: cliente.fechaConsentimiento,
      },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

const revocar = async (req, res) => {
  try {
    const { telefono } = req.body
    if (!telefono) {
      return res.status(400).json({ success: false, message: 'telefono es obligatorio' })
    }
    const cliente = await consentimientoService.revocarConsentimiento({ telefono })
    return res.status(200).json({
      success: true,
      message: 'Consentimiento revocado',
      data: {
        telefono: cliente.telefono,
        consentimientoTransferencia: cliente.consentimientoTransferencia,
      },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

module.exports = { otorgar, revocar }