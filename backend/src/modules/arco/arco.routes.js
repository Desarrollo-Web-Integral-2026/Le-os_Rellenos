const { Router } = require('express')
const {
  crearSolicitud,
  getSolicitudes,
  resolverSolicitud,
  anonimizarCliente,
} = require('./arco.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')

const router = Router()

// Criterio 1 — público, el cliente NO necesita login para solicitar
router.post('/solicitud', crearSolicitud)

// Admin — gestión de solicitudes, protegido
router.get('/solicitudes', verifyToken, verifyRole(ROLES.ADMIN), getSolicitudes)
router.patch('/solicitud/:id/resolver', verifyToken, verifyRole(ROLES.ADMIN), resolverSolicitud)
router.patch('/cliente/:id/anonimizar', verifyToken, verifyRole(ROLES.ADMIN), anonimizarCliente)

module.exports = router