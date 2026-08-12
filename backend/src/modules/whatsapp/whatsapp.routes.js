const { Router } = require('express')
const { generarLink } = require('./whatsapp.controller')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

// Público — el cliente arma su pedido sin login
router.post(
  '/generar-link',
  auditLog('GENERACION_LINK_WHATSAPP', 'Cliente', 'Cliente genera link de pedido hacia WhatsApp'),
  generarLink
)

module.exports = router