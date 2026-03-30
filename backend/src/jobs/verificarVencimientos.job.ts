// backend/src/jobs/verificarVencimientos.job.ts

import { PrismaClient, EstadoObligacion } from '@prisma/client';

const prisma = new PrismaClient();

export async function verificarVencimientos() {
  try {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const en7Dias = new Date(ahora);
    en7Dias.setDate(ahora.getDate() + 7);

    // PENDIENTE -> PROXIMO (dentro de 7 días)
    await prisma.obligacion.updateMany({
      where: {
        estado: EstadoObligacion.PENDIENTE,
        fechaVencimiento: {
          gte: ahora,
          lte: en7Dias,
        },
      },
      data: { estado: EstadoObligacion.PROXIMO },
    });

    // PENDIENTE/PROXIMO -> VENCIDO (ya pasó la fecha)
    await prisma.obligacion.updateMany({
      where: {
        estado: { in: [EstadoObligacion.PENDIENTE, EstadoObligacion.PROXIMO] },
        fechaVencimiento: { lt: ahora },
      },
      data: { estado: EstadoObligacion.VENCIDO },
    });

    console.log('[JOB] Vencimientos verificados correctamente');
  } catch (error) {
    console.error('[JOB] Error verificando vencimientos:', error);
  }
}
