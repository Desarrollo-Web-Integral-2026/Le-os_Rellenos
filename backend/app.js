require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Leños Rellenos funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

process.on('SIGINT', async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('Conexión a MongoDb cerrada por terminación de la app');
});