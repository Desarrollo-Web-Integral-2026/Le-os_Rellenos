// scripts/seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const Administrador = require('../models/Administrador.model')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)

  const existe = await Administrador.findOne({ correo: process.env.ADMIN_CORREO })
  if (!existe) {
    await Administrador.create({
      nombre: process.env.ADMIN_NOMBRE || 'Administrador',
      correo: process.env.ADMIN_CORREO,
      password: process.env.ADMIN_PASSWORD,
    })
    console.log('Admin creado correctamente')
  } else {
    console.log('El admin ya existe')
  }

  await mongoose.disconnect()
}

seed()