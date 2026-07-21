const mongoose = require('mongoose')

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('MONGO_URI no esta definida en las variables de entorno');
        }

        await mongoose.connect(uri, {
            tls: true,
            serverSelectionTimeoutMS: 10000
        });

        console.log('Conexión a Mongo Atlas establecida correctamente');

        mongoose.connection.on('error', (err) => {
            console.error('Error en la conexion de MongoDB:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB desconectado, intentando reconectar...');
        });
    } catch (error) {
        console.error('Error al conectar a Mongo Atlas:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB