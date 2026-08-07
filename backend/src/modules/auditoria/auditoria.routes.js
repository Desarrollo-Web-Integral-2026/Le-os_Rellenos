const { Router } = require('express')
const { getLogs } = require('./auditoria.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')

const router = Router()

// Criterio 3 — solo el admin puede consultar los logs
router.get('/logs', verifyToken, verifyRole(ROLES.ADMIN), getLogs)

module.exports = router