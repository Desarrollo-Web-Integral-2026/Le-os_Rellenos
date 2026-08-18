const pedidoService = require('./pedido.service')
const { success, error } = require('../../utils/response')
const asyncHandler = require('../../utils/asyncHandler')

const getPedidos = asyncHandler(async (req, res) => {
  const { estado } = req.query
  const pedidos = await pedidoService.getPedidos({ estado })
  return success(res, 200, pedidos)
})

const getPedidoById = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.obtenerPedidoPorId(req.params.id)
  return success(res, 200, pedido)
})

const createPedido = asyncHandler(async (req, res) => {
  const { nombreCliente, telefono, ubicacion, productos, metodoEnvio, observaciones } = req.body

  if (!nombreCliente || typeof nombreCliente !== 'string') {
    return error(res, 400, 'nombreCliente es obligatorio y debe ser texto')
  }
  if (!telefono || typeof telefono !== 'string') {
    return error(res, 400, 'telefono es obligatorio y debe ser texto')
  }
  if (!Array.isArray(productos) || productos.length === 0) {
    return error(res, 400, 'productos debe ser un arreglo con al menos un elemento')
  }

  const pedido = await pedidoService.crearPedido({
    nombreCliente,
    telefono,
    ubicacion,
    productos,
    metodoEnvio,
    observaciones,
  })

  return success(res, 201, pedido, 'Pedido creado correctamente')
})

const updateEstadoPedido = asyncHandler(async (req, res) => {
  const { estado } = req.body
  if (!estado || typeof estado !== 'string') {
    return error(res, 400, 'estado es obligatorio y debe ser texto')
  }
  const pedido = await pedidoService.actualizarEstado(req.params.id, estado)
  return success(res, 200, pedido, 'Estado del pedido actualizado correctamente')
})

const deletePedido = asyncHandler(async (req, res) => {
  await pedidoService.eliminarPedido(req.params.id)
  return success(res, 200, null, 'Pedido eliminado correctamente')
})

module.exports = { getPedidos, getPedidoById, createPedido, updateEstadoPedido, deletePedido }