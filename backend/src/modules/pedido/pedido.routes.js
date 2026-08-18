const { Router } = require('express')
const {
  getPedidos,
  getPedidoById,
  createPedido,
  updateEstadoPedido,
  deletePedido,
} = require('./pedido.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { verifyRole, ROLES } = require('../../middlewares/role.middleware')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

// Público — el cliente crea su pedido al hacer checkout, sin login
router.post('/', auditLog('CREACION', 'Pedido', 'Cliente crea un nuevo pedido'), createPedido)

// Público — seguimiento del pedido por id (pantalla "Seguimiento de tu Leño" del caso de estudio)
router.get('/:id', getPedidoById)

// Admin — listado completo para el panel de control (RF8)
router.get(
  '/',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('LECTURA', 'Pedido', 'Admin consulta listado de pedidos'),
  getPedidos,
)

// Admin — actualizar estado del pedido
router.put(
  '/:id/estado',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('ACTUALIZACION', 'Pedido', 'Admin actualiza estado de un pedido'),
  updateEstadoPedido,
)

// Admin — eliminar pedido
router.delete(
  '/:id',
  verifyToken,
  verifyRole(ROLES.ADMIN),
  auditLog('ELIMINACION', 'Pedido', 'Admin elimina un pedido'),
  deletePedido,
)

module.exports = router