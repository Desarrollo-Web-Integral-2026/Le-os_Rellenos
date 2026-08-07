const Cliente = require('../../models/Cliente.model')

const buscarClientePorTelefono = async (telefono) => {
  const clientes = await Cliente.find()
  return clientes.find((c) => c.telefono === telefono) || null
}

const otorgarConsentimiento = async ({ telefono, finalidad }) => {
  const cliente = await buscarClientePorTelefono(telefono)

  if (!cliente) {
    const err = new Error('Cliente no encontrado')
    err.status = 404
    throw err
  }

  cliente.consentimientoTransferencia = true
  cliente.fechaConsentimiento = new Date()
  cliente.finalidadConsentimiento = finalidad || 'Envío de pedido a servicio de mensajería externo'
  await cliente.save()

  return cliente
}

const revocarConsentimiento = async ({ telefono }) => {
  const cliente = await buscarClientePorTelefono(telefono)

  if (!cliente) {
    const err = new Error('Cliente no encontrado')
    err.status = 404
    throw err
  }

  cliente.consentimientoTransferencia = false
  cliente.fechaConsentimiento = null
  await cliente.save()

  return cliente
}

module.exports = { otorgarConsentimiento, revocarConsentimiento, buscarClientePorTelefono }