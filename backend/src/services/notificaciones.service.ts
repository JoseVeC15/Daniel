// backend/src/services/notificaciones.service.ts

import { PrismaClient, TipoNotificacion } from '@prisma/client';

const prisma = new PrismaClient();

interface CrearNotificacionData {
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  entidadTipo?: string;
  entidadId?: string;
}

export class NotificacionesService {

  async crear(data: CrearNotificacionData) {
    return prisma.notificacion.create({
      data: {
        usuarioId: data.usuarioId,
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipo: data.tipo as TipoNotificacion,
        entidadTipo: data.entidadTipo,
        entidadId: data.entidadId,
      },
    });
  }

  async listar(usuarioId: string, soloNoLeidas: boolean = false) {
    const where: any = { usuarioId };
    if (soloNoLeidas) where.leida = false;

    return prisma.notificacion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async contarNoLeidas(usuarioId: string) {
    return prisma.notificacion.count({
      where: { usuarioId, leida: false },
    });
  }

  async marcarLeida(id: string) {
    return prisma.notificacion.update({
      where: { id },
      data: { leida: true, leidaEn: new Date() },
    });
  }

  async marcarTodasLeidas(usuarioId: string) {
    return prisma.notificacion.updateMany({
      where: { usuarioId, leida: false },
      data: { leida: true, leidaEn: new Date() },
    });
  }
}
