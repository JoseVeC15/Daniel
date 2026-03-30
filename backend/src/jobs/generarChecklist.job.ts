// backend/src/jobs/generarChecklist.job.ts

import { ChecklistService } from '../services/checklist.service';
import { ObligacionesService } from '../services/obligaciones.service';

const checklistService = new ChecklistService();
const obligacionesService = new ObligacionesService();

export async function generarChecklistMensual() {
  try {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;

    // Generar checklist del mes
    await checklistService.generar(anio, mes);
    console.log(`[JOB] Checklist generado para ${mes}/${anio}`);

    // Generar obligaciones del período
    const nuevas = await obligacionesService.generarObligacionesPeriodo(anio, mes);
    console.log(`[JOB] ${nuevas.length} obligaciones generadas para ${mes}/${anio}`);
  } catch (error) {
    console.error('[JOB] Error generando checklist mensual:', error);
  }
}
