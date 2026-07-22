const cron = require('node-cron');
const { processExpiredClientData } = require('../services/dataLifecycle.service');

function startDataRetentionJob() {
    // Corre todos los dias a las 3:00 AM
    cron.schedule('0 3 * * *', async () => {
        console.log('[DataRetentionJob] Iniciando revición de los datos de clientes vencidos')
        try {
            const resultado = await processExpiredClientData();
            console.log(`[DataRetentionJob] Revisados: ${resultado.revisados} | Anonimizados: ${resultado.anonimizados.length}`);
        } catch (error) {
            console.error('[DataRetentionJob] Error durante el proceso:', error.message);
        }
    });

    console.log('[DataRetentionJob] Job de retención programado (3:00 AM diario).');
}

module.exports = { startDataRetentionJob };