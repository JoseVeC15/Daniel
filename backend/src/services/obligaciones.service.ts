// backend/src/services/obligaciones.service.ts

import { PrismaClient, EstadoObligacion, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface FiltrosObligacion {
  estado?: string;
  categoria?: string;
  anio?: number;
  mes?: number;
}

export class ObligacionesService {
  
  async getDashboard() {
    const ahora = new Date();
    const [proximosVencimientos, indicadores] = await Promise.all([
      this.getProximosVencimientos(5),
      this.getIndicadoresMes(ahora.getFullYear(), ahora.getMonth() + 1),
    ]);

    return {
      proximosVencimientos,
      indicadores,
      fechaActual: ahora,
    };
  }

  async getProximosVencimientos(limite: number = 10) {
    return prisma.obligacion.findMany({
      where: {
        estado: { in: [EstadoObligacion.PENDIENTE, EstadoObligacion.PROXIMO] },
        fechaVencimiento: { gte: new Date() },
      },
      include: {
        tipoObligacion: true,
      },
      orderBy: { fechaVencimiento: 'asc' },
      take: limite,
    });
  }

  async getIndicadoresMes(anio: number, mes: number) {
    const obligaciones = await prisma.obligacion.findMany({
      where: { anio, mes },
    });

    const total = obligaciones.length;
    const cumplidas = obligaciones.filter(o => o.estado === EstadoObligacion.CUMPLIDO).length;
    const pendientes = obligaciones.filter(o => 
      o.estado === EstadoObligacion.PENDIENTE || o.estado === EstadoObligacion.PROXIMO
    ).length;
    const vencidas = obligaciones.filter(o => o.estado === EstadoObligacion.VENCIDO).length;

    return {
      anio,
      mes,
      total,
      cumplidas,
      pendientes,
      vencidas,
      porcentajeCumplimiento: total > 0 ? Math.round((cumplidas / total) * 100) : 0,
    };
  }

  async listar(filtros: FiltrosObligacion) {
    const where: Prisma.ObligacionWhereInput = {};
    
    if (filtros.estado) {
      where.estado = filtros.estado as EstadoObligacion;
    }
    if (filtros.categoria) {
      where.tipoObligacion = { 
        categoria: filtros.categoria as any 
      };
    }
    if (filtros.anio) where.anio = filtros.anio;
    if (filtros.mes) where.mes = filtros.mes;

    return prisma.obligacion.findMany({
      where,
      include: { tipoObligacion: true },
      orderBy: { fechaVencimiento: 'asc' },
    });
  }

  async obtenerPorId(id: string) {
    return prisma.obligacion.findUnique({
      where: { id },
      include: { 
        tipoObligacion: true,
        alertasEnviadas: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async actualizarEstado(id: string, estado: EstadoObligacion) {
    return prisma.obligacion.update({
      where: { id },
      data: { estado },
      include: { tipoObligacion: true },
    });
  }

  async marcarCumplida(id: string, observaciones?: string) {
    return prisma.obligacion.update({
      where: { id },
      data: {
        estado: EstadoObligacion.CUMPLIDO,
        fechaCumplimiento: new Date(),
        observaciones,
      },
      include: { tipoObligacion: true },
    });
  }

  async getCalendarioMensual(anio: number, mes: number) {
    const obligaciones = await prisma.obligacion.findMany({
      where: { anio, mes },
      include: { tipoObligacion: true },
      orderBy: { fechaVencimiento: 'asc' },
    });

    // Agrupar por día
    const porDia: Record<number, typeof obligaciones> = {};
    for (const ob of obligaciones) {
      const dia = ob.fechaVencimiento.getDate();
      if (!porDia[dia]) porDia[dia] = [];
      porDia[dia].push(ob);
    }

    return { anio, mes, obligaciones, porDia };
  }

  async getCalendarioSemanal(fecha: Date) {
    const inicioSemana = new Date(fecha);
    inicioSemana.setDate(fecha.getDate() - fecha.getDay()); // Domingo
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    return prisma.obligacion.findMany({
      where: {
        fechaVencimiento: {
          gte: inicioSemana,
          lte: finSemana,
        },
      },
      include: { tipoObligacion: true },
      orderBy: { fechaVencimiento: 'asc' },
    });
  }

  async getProximos30Dias() {
    const ahora = new Date();
    const en30Dias = new Date();
    en30Dias.setDate(ahora.getDate() + 30);

    return prisma.obligacion.findMany({
      where: {
        fechaVencimiento: {
          gte: ahora,
          lte: en30Dias,
        },
      },
      include: { tipoObligacion: true },
      orderBy: { fechaVencimiento: 'asc' },
    });
  }

  async getTiposObligacion() {
    return prisma.tipoObligacion.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  // Generar obligaciones del período
  async generarObligacionesPeriodo(anio: number, mes: number) {
    const tipos = await prisma.tipoObligacion.findMany({
      where: { activo: true },
    });

    const obligacionesCreadas = [];

    for (const tipo of tipos) {
      const debeGenerar = this.debeGenerarParaPeriodo(tipo, anio, mes);
      if (!debeGenerar) continue;

      const fechaVencimiento = this.calcularFechaVencimiento(tipo, anio, mes);

      const existente = await prisma.obligacion.findUnique({
        where: {
          tipoObligacionId_anio_mes: {
            tipoObligacionId: tipo.id,
            anio,
            mes: tipo.frecuencia === 'ANUAL' ? null! : mes,
          },
        },
      });

      if (!existente) {
        const nueva = await prisma.obligacion.create({
          data: {
            tipoObligacionId: tipo.id,
            anio,
            mes: tipo.frecuencia === 'ANUAL' ? null : mes,
            fechaVencimiento,
            estado: EstadoObligacion.PENDIENTE,
          },
        });
        obligacionesCreadas.push(nueva);
      }
    }

    return obligacionesCreadas;
  }

  private debeGenerarParaPeriodo(tipo: any, anio: number, mes: number): boolean {
    switch (tipo.frecuencia) {
      case 'MENSUAL':
        return true;
      case 'ANUAL':
        return tipo.mesVencimiento === mes;
      case 'SEMESTRAL':
        return mes === tipo.mesVencimiento || mes === ((tipo.mesVencimiento + 6 - 1) % 12) + 1;
      case 'TRIMESTRAL':
        return [3, 6, 9, 12].includes(mes);
      default:
        return false;
    }
  }

  private calcularFechaVencimiento(tipo: any, anio: number, mes: number): Date {
    const dia = tipo.diaVencimiento || 1;
    // Ajustar el día al último día del mes si es necesario
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const diaReal = Math.min(dia, ultimoDia);
    return new Date(anio, mes - 1, diaReal, 23, 59, 59);
  }
}
