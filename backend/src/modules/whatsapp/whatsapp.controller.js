const { construirMensajePedido, construirLinkWhatsApp } = require('../../utils/whatsapp.util')

const generarLink = async (req, res) => {
  try {
    const { nombreCliente, direccion, productos, total } = req.body

    if (!nombreCliente || typeof nombreCliente !== 'string') {
      return res.status(400).json({ success: false, message: 'nombreCliente es obligatorio y debe ser texto' })
    }
    if (!direccion || typeof direccion !== 'string') {
      return res.status(400).json({ success: false, message: 'direccion es obligatoria y debe ser texto' })
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ success: false, message: 'productos debe ser un arreglo con al menos un elemento' })
    }
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ success: false, message: 'total es obligatorio y debe ser un número positivo' })
    }

    const mensaje = construirMensajePedido({ nombreCliente, direccion, productos, total })
    const link = construirLinkWhatsApp(mensaje)

    return res.status(200).json({
      success: true,
      message: 'Link de WhatsApp generado correctamente',
      data: { link, mensaje },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

module.exports = { generarLink }