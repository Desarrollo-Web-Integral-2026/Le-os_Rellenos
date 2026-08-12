const NUMERO_NEGOCIO = process.env.WHATSAPP_NUMERO_NEGOCIO // formato: 521XXXXXXXXXX (con lada país + código celular MX)

// Arma el texto del mensaje con los datos del pedido, igual al formato del caso de estudio
const construirMensajePedido = ({ nombreCliente, direccion, productos, total }) => {
  const listaProductos = productos
    .map((p) => `${p.cantidad}x ${p.nombre}`)
    .join('\n')

  const mensaje =
    `¡Hola! *Nuevo pedido*\n` +
    `*Cliente:* ${nombreCliente}\n` +
    `*Dirección:* ${direccion}\n` +
    `*Detalle:*\n${listaProductos}\n` +
    `*Total:* $${total.toFixed(2)}`

  return mensaje
}

// Arma el link wa.me completo, con el texto ya codificado para URL
const construirLinkWhatsApp = (mensaje) => {
  if (!NUMERO_NEGOCIO) {
    throw new Error('WHATSAPP_NUMERO_NEGOCIO no está definido en las variables de entorno')
  }
  const textoCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${NUMERO_NEGOCIO}?text=${textoCodificado}`
}

module.exports = { construirMensajePedido, construirLinkWhatsApp }