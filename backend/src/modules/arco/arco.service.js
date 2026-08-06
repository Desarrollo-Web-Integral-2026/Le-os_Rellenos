const SolicitudArco = require('../../models/SolicitudArco.model')
const Cliente = require('../../models/Cliente.model')

// Busca un cliente por teléfono, comparando en memoria
// (necesario porque el teléfono está cifrado con IV aleatorio -> no se puede buscar directo en Mongo)
const buscarClientePorTelefono = async (telefono) => {
  const clientes = await Cliente.find() // el hook post('find') ya descifra automáticamente
  return clientes.find((c) => c.telefono === telefono) || null
}

// Criterio 1 — crear solicitud (pública, sin login)
const crearSolicitud = async ({ tipo, telefono, datosSolicitados, motivo }) => {
  const solicitud = new SolicitudArco({
    tipo,
    telefono,
    datosSolicitados,
    motivo,
  })
  return await solicitud.save()
}

// Admin — listar solicitudes
const getSolicitudes = async () => {
  return await SolicitudArco.find().sort({ fechaSolicitud: -1 })
}

// Criterio 4 — resolver solicitud, siempre queda registrada
const resolverSolicitud = async (id) => {
  const solicitud = await SolicitudArco.findById(id)
  if (!solicitud) {
    const err = new Error('Solicitud no encontrada')
    err.status = 404
    throw err
  }

  const cliente = await buscarClientePorTelefono(solicitud.telefono)

  if (!cliente) {
    solicitud.estado = 'rechazada'
    solicitud.resultado = 'No se encontró cliente asociado a este teléfono'
    solicitud.fechaResolucion = new Date()
    return await solicitud.save()
  }

  solicitud.id_cliente = cliente._id

  switch (solicitud.tipo) {
    case 'acceso':
      // Criterio 1 — se le entregan sus datos (ya vienen descifrados por el hook)
      solicitud.resultado = JSON.stringify({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        ubicacion: cliente.ubicacion,
        finalidad: cliente.finalidad,
      })
      break

    case 'rectificacion':
      if (solicitud.datosSolicitados) {
        // cliente ya viene descifrado en memoria; al hacer .save() el hook pre('save')
        // vuelve a cifrar los campos modificados automáticamente
        Object.assign(cliente, solicitud.datosSolicitados)
        await cliente.save()
      }
      solicitud.resultado = 'Datos actualizados correctamente'
      break

    case 'cancelacion':
      // Criterio 2 — bloqueo temporal, NO borrado inmediato
      cliente.estado = 'bloqueado'
      await cliente.save()
      solicitud.resultado = `Cliente bloqueado. Se anonimizará tras ${cliente.diasRetencion} días de retención.`
      break

    case 'oposicion':
      cliente.estado = 'bloqueado'
      await cliente.save()
      solicitud.resultado = 'Cliente marcado en oposición, se detiene todo contacto futuro'
      break
  }

  solicitud.estado = 'resuelta'
  solicitud.fechaResolucion = new Date() // Criterio 4
  return await solicitud.save()
}

// Criterio 3 — anonimización que NO rompe integridad referencial
const anonimizarCliente = async (id) => {
  const cliente = await Cliente.findById(id)
  if (!cliente) {
    const err = new Error('Cliente no encontrado')
    err.status = 404
    throw err
  }

  // No se hace Cliente.findByIdAndDelete() — se sobreescriben los datos, el _id se conserva
  cliente.nombre = 'Usuario anonimizado'
  cliente.telefono = `0000000000-${cliente._id}` // se mantiene único, ya no identifica a nadie
  cliente.ubicacion = 'N/A'
  cliente.estado = 'anonimizado'
  cliente.fechaAnonimizacion = new Date()

  return await cliente.save()
}

module.exports = { crearSolicitud, getSolicitudes, resolverSolicitud, anonimizarCliente }