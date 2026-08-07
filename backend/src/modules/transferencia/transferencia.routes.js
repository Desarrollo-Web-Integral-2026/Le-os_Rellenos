const { Router } = require('express')
const { transferir } = require('./transferencia.controller')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

router.post(
  '/enviar',
  auditLog('TRANSFERENCIA_TERCERO', 'Cliente', 'Envío de datos de pedido a servicio externo'),
  transferir
)

module.exports = router