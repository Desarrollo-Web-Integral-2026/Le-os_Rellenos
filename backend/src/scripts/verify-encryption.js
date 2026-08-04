require('dotenv').config()
const mongoose = require('mongoose')

const verifyEncryption = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('[Verificación] Conectado a MongoDB')

    // Consulta directa sin pasar por los hooks — simula acceso directo al disco
    const docs = await mongoose.connection.db
      .collection('clientes')
      .find({})
      .limit(3)
      .toArray()

    console.log('\n[Verificación] Datos en la BD (acceso directo):')
    docs.forEach((doc) => {
      console.log({
        nombre: doc.nombre,
        telefono: doc.telefono,
        ubicacion: doc.ubicacion,
      })
    })

    const isEncrypted = docs.every((doc) => {
      return (
        doc.nombre?.includes(':') &&
        doc.telefono?.includes(':')
      )
    })

    if (isEncrypted) {
      console.log('\n✅ Criterio 3 CUMPLIDO — Datos cifrados en reposo')
      console.log('Un acceso directo al disco/backup NO expone datos legibles\n')
    } else {
      console.log('\n❌ Criterio 3 NO cumplido — Hay datos en texto plano\n')
    }

    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

verifyEncryption()