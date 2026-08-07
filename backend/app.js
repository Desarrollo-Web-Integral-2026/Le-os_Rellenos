require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const { startDataRetentionJob } = require('./src/jobs/dataRetention.job');
const { sanitizeInput } = require('./src/middlewares/sanitize.middleware')
const { apiLimiter } = require('./src/middlewares/rateLimit.middleware')
const authRoutes = require('./src/modules/auth/auth.routes')
const clientesRoutes = require('./src/modules/clientes/clientes.routes')
const arcoRouter = require('./src/modules/arco/arco.routes')
const auditoriaRoutes = require('./src/modules/auditoria/auditoria.routes')
const consentimientoRoutes = require('./src/modules/consentimiento/consentimiento.routes')
const transferenciaRoutes = require('./src/modules/transferencia/transferencia.routes')

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
startDataRetentionJob();


app.use(express.json())
app.use(sanitizeInput)
app.use('/api', apiLimiter)

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Leños Rellenos funcionando' });
});

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/arco', arcoRouter)
app.use('/api/auditoria', auditoriaRoutes)
app.use('/api/consentimiento', consentimientoRoutes)
app.use('/api/transferencia', transferenciaRoutes)

// al final de app.js, después de todas las rutas, antes de app.listen()
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message) // el detalle solo se ve en tu consola, no al cliente
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno en el servidor',
  })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

process.on('SIGINT', async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('Conexión a MongoDb cerrada por terminación de la app');
});