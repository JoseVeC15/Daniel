// backend/src/jobs/enviarAlertas.job.ts

import { AlertasService } from '../services/alertas.service';

const alertasService = new AlertasService();

export async function enviarAlertas() {
  try {
    await alertasService.verificarYEnviarAlertas();
    console.log('[JOB] Alertas procesadas correctamente');
  } catch (error) {
    console.error('[JOB] Error enviando alertas:', error);
  }
}
