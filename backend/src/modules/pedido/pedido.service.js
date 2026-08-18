const mongoose = require('mongoose')
const Pedido = require('../../models/Pedido.model')
const DetallePedido = require('../../models/DetallePedido.model')
const Producto = require('../../models/Producto.model')
const { creaetOrFindCliente } = require('../clientes/clientes.service')

const ESTADOS_VALIDOS = ['nuevo', 'en_preparacion', 'en_camino', 'completado']

function crearError(mensaje, status) {
  const err = new Error(mensaje)
  err.status = status
  err.statusCode = status // compatibilidad con errorHandler centralizado (RNF6)
  return err
}

// Arma el pedido completo con detalles + datos de cliente para respuestas consistentes
async function obtenerPedidoPorId(id) {
  const pedido = await Pedido.findById(id).populate('cliente', 'nombre telefono ubicacion')
  if (!pedido) {
    throw crearError('Pedido no encontrado', 404)
  }
  const detalles = await DetallePedido.find({ pedido: pedido._id }).populate(
    'producto',
    'nombre precio imagen'
  )
  return { ...pedido.toObject(), detalles }
}

async function getPedidos(filtros = {}) {
  const query = {}
  if (filtros.estado) query.estado = filtros.estado

  const pedidos = await Pedido.find(query)
    .populate('cliente', 'nombre telefono ubicacion')
    .sort({ createdAt: -1 })

  return await Promise.all(
    pedidos.map(async (p) => {
      const detalles = await DetallePedido.find({ pedido: p._id }).populate(
        'producto',
        'nombre precio imagen'
      )
      return { ...p.toObject(), detalles }
    })
  )
}

// Criterio de seguridad clave: el precio y disponibilidad SIEMPRE se leen de la
// BD, nunca del body del request — un cliente podría mandar cualquier precio
// manipulado desde DevTools (ver nota dejada en RF9/RF3 del frontend).
async function crearPedido({ nombreCliente, telefono, ubicacion, productos, metodoEnvio, observaciones }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw crearError('Debe incluir al menos un producto en el pedido', 400)
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { cliente } = await creaetOrFindCliente({ nombre: nombreCliente, telefono, ubicacion })

    let total = 0
    const detallesData = []

    for (const item of productos) {
      if (!item.producto || !item.cantidad || item.cantidad < 1) {
        throw crearError('Cada producto debe incluir un id válido y cantidad mayor a 0', 400)
      }

      const productoDb = await Producto.findById(item.producto).session(session)

      if (!productoDb) {
        throw crearError(`Producto no encontrado: ${item.producto}`, 404)
      }
      if (!productoDb.disponible) {
        throw crearError(`El producto "${productoDb.nombre}" no está disponible actualmente`, 400)
      }
      if (productoDb.stock < item.cantidad) {
        throw crearError(
          `Stock insuficiente para "${productoDb.nombre}" (disponible: ${productoDb.stock})`,
          400,
        )
      }

      const precioUnitario = productoDb.precio
      total += precioUnitario * item.cantidad

      productoDb.stock -= item.cantidad
      await productoDb.save({ session })

      detallesData.push({ producto: productoDb._id, cantidad: item.cantidad, precioUnitario })
    }

    const [pedido] = await Pedido.create(
      [{ cliente: cliente._id, total, estado: 'nuevo', metodoEnvio, observaciones }],
      { session },
    )

    const detalles = detallesData.map((d) => ({ ...d, pedido: pedido._id }))
    await DetallePedido.insertMany(detalles, { session })

    await session.commitTransaction()
    session.endSession()

    return await obtenerPedidoPorId(pedido._id)
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

async function actualizarEstado(id, nuevoEstado) {
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    throw crearError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400)
  }

  const pedido = await Pedido.findByIdAndUpdate(
    id,
    { estado: nuevoEstado },
    { new: true, runValidators: true },
  )

  if (!pedido) {
    throw crearError('Pedido no encontrado', 404)
  }

  return pedido
}

async function eliminarPedido(id) {
  const pedido = await Pedido.findById(id)
  if (!pedido) {
    throw crearError('Pedido no encontrado', 404)
  }

  await DetallePedido.deleteMany({ pedido: pedido._id })
  await Pedido.findByIdAndDelete(id)

  return pedido
}

module.exports = { getPedidos, obtenerPedidoPorId, crearPedido, actualizarEstado, eliminarPedido }