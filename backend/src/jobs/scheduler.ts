// backend/src/jobs/scheduler.ts

import cron from 'node-cron';
import { generarChecklistMensual } from './generarChecklist.job';
import { verificarVencimientos } from './verificarVencimientos.job';
import { enviarAlertas } from './enviarAlertas.job';

export function initScheduler() {
  console.log('Iniciando scheduler de jobs...');

  // Cada día a las 7:00 AM - Verificar vencimientos y enviar alertas
  cron.schedule('0 7 * * *', async () => {
    console.log('[CRON] Verificando vencimientos...');
    await verificarVencimientos();
    
    console.log('[CRON] Enviando alertas...');
    await enviarAlertas();
  }, {
    timezone: 'America/Asuncion',
  });

  // Día 1 de cada mes a las 00:01 - Generar checklist y obligaciones
  cron.schedule('1 0 1 * *', async () => {
    console.log('[CRON] Generando checklist mensual...');
    await generarChecklistMensual();
  }, {
    timezone: 'America/Asuncion',
  });

  // Cada hora - Actualizar estados (PENDIENTE -> PROXIMO, PROXIMO -> VENCIDO)
  cron.schedule('0 * * * *', async () => {
    await verificarVencimientos();
  }, {
    timezone: 'America/Asuncion',
  });

  console.log('Scheduler iniciado correctamente');
}
