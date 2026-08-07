const transferenciaService = require('./transferencia.service')

const transferir = async (req, res) => {
  try {
    const { telefono, datosPedido } = req.body
    if (!telefono) {
      return res.status(400).json({ success: false, message: 'telefono es obligatorio' })
    }
    const resultado = await transferenciaService.transferirDatosATercero({ telefono, datosPedido })
    return res.status(200).json({
      success: true,
      message: 'Datos transferidos correctamente',
      data: resultado,
    })
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message })
  }
}

module.exports = { transferir }