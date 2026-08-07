const { Router } = require('express')
const { otorgar, revocar } = require('./consentimiento.controller')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

router.post(
  '/otorgar',
  auditLog('CONSENTIMIENTO_OTORGADO', 'Cliente', 'Cliente otorga consentimiento de transferencia a terceros'),
  otorgar
)

router.post(
  '/revocar',
  auditLog('CONSENTIMIENTO_REVOCADO', 'Cliente', 'Cliente revoca consentimiento de transferencia a terceros'),
  revocar
)

module.exports = router