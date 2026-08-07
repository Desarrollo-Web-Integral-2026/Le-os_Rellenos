require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const { startDataRetentionJob } = require('./src/jobs/dataRetention.job');
const authRoutes = require('./src/modules/auth/auth.routes')
const clientesRoutes = require('./src/modules/clientes/clientes.routes')
const arcoRouter = require('./src/modules/arco/arco.routes')
const auditoriaRoutes = require('./src/modules/auditoria/auditoria.routes')

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
startDataRetentionJob();


app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Leños Rellenos funcionando' });
});

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/arco', arcoRouter)
app.use('/api/auditoria', auditoriaRoutes)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

process.on('SIGINT', async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('Conexión a MongoDb cerrada por terminación de la app');
});