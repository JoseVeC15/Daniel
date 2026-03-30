// backend/src/services/checklist.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CompletarItemData {
  usuarioId: string;
  observaciones?: string;
  comprobanteUrl?: string;
  comprobanteNombre?: string;
}

export class ChecklistService {

  async obtenerOCrear(anio: number, mes: number) {
    let checklist = await prisma.checklistMensual.findUnique({
      where: { anio_mes: { anio, mes } },
      include: {
        items: {
          include: {
            itemTemplate: true,
            completadoPor: {
              select: { id: true, nombre: true, email: true },
            },
          },
          orderBy: {
            itemTemplate: { orden: 'asc' },
          },
        },
      },
    });

    if (!checklist) {
      checklist = await this.generar(anio, mes);
    }

    // Calcular resumen
    const totalItems = checklist.items.length;
    const completados = checklist.items.filter(i => i.completado).length;

    return {
      ...checklist,
      resumen: {
        total: totalItems,
        completados,
        pendientes: totalItems - completados,
        porcentaje: totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0,
      },
    };
  }

  async generar(anio: number, mes: number) {
    // Obtener templates activos
    const templates = await prisma.itemChecklistTemplate.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });

    return prisma.checklistMensual.create({
      data: {
        anio,
        mes,
        items: {
          create: templates.map(template => ({
            itemTemplateId: template.id,
            completado: false,
          })),
        },
      },
      include: {
        items: {
          include: {
            itemTemplate: true,
            completadoPor: {
              select: { id: true, nombre: true, email: true },
            },
          },
          orderBy: {
            itemTemplate: { orden: 'asc' },
          },
        },
      },
    });
  }

  async completarItem(id: string, data: CompletarItemData) {
    return prisma.checklistCompletado.update({
      where: { id },
      data: {
        completado: true,
        fechaCompletado: new Date(),
        completadoPorId: data.usuarioId,
        observaciones: data.observaciones,
        comprobanteUrl: data.comprobanteUrl,
        comprobanteNombre: data.comprobanteNombre,
      },
      include: {
        itemTemplate: true,
        completadoPor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });
  }

  async desmarcarItem(id: string) {
    return prisma.checklistCompletado.update({
      where: { id },
      data: {
        completado: false,
        fechaCompletado: null,
        completadoPorId: null,
        observaciones: null,
        comprobanteUrl: null,
        comprobanteNombre: null,
      },
      include: { itemTemplate: true },
    });
  }

  async getHistorial(anioDesde: number, anioHasta: number) {
    return prisma.checklistMensual.findMany({
      where: {
        anio: { gte: anioDesde, lte: anioHasta },
      },
      include: {
        items: {
          include: {
            itemTemplate: true,
            completadoPor: {
              select: { id: true, nombre: true },
            },
          },
        },
      },
      orderBy: [{ anio: 'desc' }, { mes: 'desc' }],
    });
  }
}
