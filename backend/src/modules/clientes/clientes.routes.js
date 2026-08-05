const { Router } = require('express')
const { getClientes, getClienteById } = require('./clientes.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')

const router = Router()

router.get('/', verifyToken, verifyRole(ROLES.ADMIN), getClientes)
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), getClienteById)

module.exports = router