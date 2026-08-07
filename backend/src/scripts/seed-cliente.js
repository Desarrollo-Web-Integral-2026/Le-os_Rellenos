require('dotenv').config()
const mongoose = require('mongoose')
const Cliente = require('../models/Cliente.model')

const seedCliente = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('[Seed] Conectado a MongoDB')

    // Primero borra el cliente de prueba anterior
    await mongoose.connection.db.collection('clientes').deleteMany({})
    console.log('[Seed] Colección limpiada')

    // Insertar pasando por los hooks de Mongoose (se cifra automáticamente)
    const cliente = new Cliente({
        nombre: 'Manuel Lopez',
        telefono: '4181108329',
        ubicacion: 'San Diego de la Union, Guanajuato',
        finalidad: 'pedido',
        diasRetencion: 365,
        estado: 'activo',
    })

await cliente.save()

    console.log('[Seed] Cliente creado con id:', cliente._id)
    console.log('[Seed] Listo, ahora corre: npm run verify:encryption')

    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

seedCliente()