const axios = require('axios')
const { buscarClientePorTelefono } = require('../consentimiento/consentimiento.service')

const API_EXTERNA_URL = process.env.API_EXTERNA_URL
const API_EXTERNA_TOKEN = process.env.API_EXTERNA_TOKEN

const transferirDatosATercero = async ({ telefono, datosPedido }) => {
  const cliente = await buscarClientePorTelefono(telefono)

  if (!cliente) {
    const err = new Error('Cliente no encontrado')
    err.status = 404
    throw err
  }

  if (!cliente.consentimientoTransferencia) {
    const err = new Error('No existe consentimiento registrado para transferir datos a terceros')
    err.status = 403
    throw err
  }

  const payload = {
    telefonoContacto: telefono,
    pedido: datosPedido,
    finalidad: cliente.finalidadConsentimiento,
  }

  try {
    const respuesta = await axios.post(API_EXTERNA_URL, payload, {
      headers: {
        Authorization: `Bearer ${API_EXTERNA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    })

    return {
      enviado: true,
      destinoStatus: respuesta.status,
    }
  } catch (axiosErr) {
    // Diferenciamos: esto es un fallo del servicio externo, no de nuestra lógica de consentimiento
    const err = new Error('El servicio externo no respondió correctamente, intenta de nuevo más tarde')
    err.status = 502
    throw err
  }
}

module.exports = { transferirDatosATercero }