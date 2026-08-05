// scripts/seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Administrador = require('../models/Administrador.model')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)

  const existe = await Administrador.findOne({ correo: process.env.ADMIN_CORREO })
  if (!existe) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    await Administrador.create({
      nombre: process.env.ADMIN_NOMBRE || 'Administrador',
      correo: process.env.ADMIN_CORREO,
      password: hash,
    })
    console.log('Admin creado correctamente')
  } else {
    console.log('El admin ya existe')
  }

  await mongoose.disconnect()
}

seed()