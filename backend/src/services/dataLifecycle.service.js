const ClienteModel = require('../models/Cliente.model');

/**
 * Anonimiza los datos personales de un cliente, sin eliminar el 
 * documento por completo, para no romper la integridad referencial
 * con sus pedidos historicos (Pedido -> Cliente).
 */
async function anonymizeCliente(cliente) {
    cliente.nombre = 'CLIENTE_ANONIMIZADO';
    cliente.telefono = '0000000000';
    cliente.ubicacion = null;
    cliente.estado = 'anonimizado';
    cliente.fechaAnonimizacion = new Date();
    await cliente.save();   // <-- minúscula: es el documento/parámetro, no el modelo
    return cliente;
}

/**
 * Revisa todos los clientes activos y anonimiza a quienes ya 
 * cumplieron su periodo de retención segun su finalidad.
 */
async function processExpiredClientData() {
    const now = new Date();
    const clientesActivos = await ClienteModel.find({ estado: 'activo' });

    const resultado = {
        revisados: clientesActivos.length,
        anonimizados: [],
    };

    for (const cliente of clientesActivos) {
        const fechaLimite = new Date(cliente.fechaRegistro);
        fechaLimite.setDate(fechaLimite.getDate() + cliente.diasRetencion);

        if (now >= fechaLimite) {
            await anonymizeCliente(cliente);
            resultado.anonimizados.push(cliente._id.toString());
        }
    }

    return resultado;
}

module.exports = { processExpiredClientData, anonymizeCliente };