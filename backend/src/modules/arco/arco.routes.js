const { Router } = require('express')
const {
  crearSolicitud,
  getSolicitudes,
  resolverSolicitud,
  anonimizarCliente,
} = require('./arco.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

router.post(
  '/solicitud',
  auditLog('CREACION', 'SolicitudArco', 'Cliente solicita ejercicio de derecho ARCO'),
  crearSolicitud
)

router.get(
  '/solicitudes',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('LECTURA', 'SolicitudArco', 'Admin consulta listado de solicitudes ARCO'),
  getSolicitudes
)

router.patch(
  '/solicitud/:id/resolver',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('RESOLUCION', 'SolicitudArco', 'Admin resuelve solicitud ARCO'),
  resolverSolicitud
)

router.patch(
  '/cliente/:id/anonimizar',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('ANONIMIZACION', 'Cliente', 'Admin ejecuta anonimización de cliente'),
  anonimizarCliente
)

module.exports = router