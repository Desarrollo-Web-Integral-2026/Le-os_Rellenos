const { Router } = require('express')
const { getClientes, getClienteById } = require('./clientes.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

router.get(
  '/', verifyToken, verifyRole(ROLES.ADMIN), auditLog('LECTURA', 'Cliente', 'Consulta de listado de clientes en panel admin'),
  getClientes
)

router.get(
  '/:id', verifyToken, verifyRole(ROLES.ADMIN), auditLog('LECTURA', 'Cliente', 'Consulta de detalle de cliente'),
  getClienteById
)

module.exports = router