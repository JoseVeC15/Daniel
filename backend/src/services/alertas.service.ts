// backend/src/services/alertas.service.ts

import { PrismaClient, TipoAlerta, CanalAlerta, EstadoObligacion } from '@prisma/client';
import { EmailService } from './email.service';
import { NotificacionesService } from './notificaciones.service';

const prisma = new PrismaClient();

export class AlertasService {

  private emailService = new EmailService();
  private notifService = new NotificacionesService();

  async obtenerConfiguracion(usuarioId: string) {
    let config = await prisma.configuracionAlerta.findUnique({
      where: { usuarioId },
    });

    if (!config) {
      config = await prisma.configuracionAlerta.create({
        data: {
          usuarioId,
          diasAntes7: true,
          diasAntes3: true,
          diasAntes1: true,
          diaVencimiento: true,
          porEmail: true,
          enSistema: true,
        },
      });
    }

    return config;
  }

  async actualizarConfiguracion(usuarioId: string, data: any) {
    return prisma.configuracionAlerta.upsert({
      where: { usuarioId },
      update: data,
      create: { usuarioId, ...data },
    });
  }

  async verificarYEnviarAlertas() {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const obligacionesPendientes = await prisma.obligacion.findMany({
      where: {
        estado: { in: [EstadoObligacion.PENDIENTE, EstadoObligacion.PROXIMO] },
      },
      include: { tipoObligacion: true },
    });

    const usuarios = await prisma.usuario.findMany({
      where: { activo: true },
      include: { configuracionAlertas: true },
    });

    for (const obligacion of obligacionesPendientes) {
      const diasRestantes = this.calcularDiasRestantes(ahora, obligacion.fechaVencimiento);
      const tipoAlerta = this.determinarTipoAlerta(diasRestantes);

      if (!tipoAlerta) continue;

      // Actualizar estado a PROXIMO si corresponde
      if (diasRestantes <= 7 && diasRestantes > 0 && obligacion.estado === EstadoObligacion.PENDIENTE) {
        await prisma.obligacion.update({
          where: { id: obligacion.id },
          data: { estado: EstadoObligacion.PROXIMO },
        });
      }

      // Marcar como VENCIDO
      if (diasRestantes < 0 && obligacion.estado !== EstadoObligacion.VENCIDO) {
        await prisma.obligacion.update({
          where: { id: obligacion.id },
          data: { estado: EstadoObligacion.VENCIDO },
        });
      }

      for (const usuario of usuarios) {
        const config = usuario.configuracionAlertas;
        if (!config || !config.activo) continue;
        if (!this.debeAlertarSegunConfig(config, tipoAlerta)) continue;

        // Verificar si ya se envió esta alerta
        const yaEnviada = await prisma.alertaEnviada.findFirst({
          where: {
            obligacionId: obligacion.id,
            tipoAlerta,
            enviada: true,
          },
        });

        if (yaEnviada) continue;

        // Enviar por email
        if (config.porEmail) {
          await this.enviarAlertaEmail(usuario, obligacion, tipoAlerta, diasRestantes);
        }

        // Notificación en sistema
        if (config.enSistema) {
          await this.crearNotificacionSistema(usuario.id, obligacion, tipoAlerta, diasRestantes);
        }
      }
    }
  }

  private calcularDiasRestantes(ahora: Date, vencimiento: Date): number {
    const diff = vencimiento.getTime() - ahora.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private determinarTipoAlerta(diasRestantes: number): TipoAlerta | null {
    if (diasRestantes === 7) return TipoAlerta.DIAS_7;
    if (diasRestantes === 3) return TipoAlerta.DIAS_3;
    if (diasRestantes === 1) return TipoAlerta.DIAS_1;
    if (diasRestantes === 0) return TipoAlerta.DIA_VENCIMIENTO;
    if (diasRestantes < 0) return TipoAlerta.VENCIDA;
    return null;
  }

  private debeAlertarSegunConfig(config: any, tipoAlerta: TipoAlerta): boolean {
    switch (tipoAlerta) {
      case TipoAlerta.DIAS_7: return config.diasAntes7;
      case TipoAlerta.DIAS_3: return config.diasAntes3;
      case TipoAlerta.DIAS_1: return config.diasAntes1;
      case TipoAlerta.DIA_VENCIMIENTO: return config.diaVencimiento;
      case TipoAlerta.VENCIDA: return true; // Siempre alertar vencidas
      default: return false;
    }
  }

  private async enviarAlertaEmail(
    usuario: any,
    obligacion: any,
    tipoAlerta: TipoAlerta,
    diasRestantes: number
  ) {
    try {
      const asunto = diasRestantes >= 0
        ? `⚠️ ${obligacion.tipoObligacion.nombre} vence en ${diasRestantes} día(s)`
        : `🔴 ${obligacion.tipoObligacion.nombre} está VENCIDA`;

      await this.emailService.enviar({
        to: usuario.email,
        subject: asunto,
        html: this.generarEmailHTML(obligacion, diasRestantes),
      });

      await prisma.alertaEnviada.create({
        data: {
          obligacionId: obligacion.id,
          tipoAlerta,
          canal: CanalAlerta.EMAIL,
          destinatarioEmail: usuario.email,
          enviada: true,
          enviadaEn: new Date(),
        },
      });
    } catch (error: any) {
      await prisma.alertaEnviada.create({
        data: {
          obligacionId: obligacion.id,
          tipoAlerta,
          canal: CanalAlerta.EMAIL,
          destinatarioEmail: usuario.email,
          enviada: false,
          error: error.message,
        },
      });
    }
  }

  private async crearNotificacionSistema(
    usuarioId: string,
    obligacion: any,
    tipoAlerta: TipoAlerta,
    diasRestantes: number
  ) {
    const titulo = diasRestantes >= 0
      ? `${obligacion.tipoObligacion.nombre} vence en ${diasRestantes} día(s)`
      : `${obligacion.tipoObligacion.nombre} está VENCIDA`;

    await this.notifService.crear({
      usuarioId,
      titulo,
      mensaje: `Fecha de vencimiento: ${obligacion.fechaVencimiento.toLocaleDateString('es-PY')}`,
      tipo: diasRestantes < 0 ? 'OBLIGACION_VENCIDA' : 'ALERTA_VENCIMIENTO',
      entidadTipo: 'obligacion',
      entidadId: obligacion.id,
    });

    await prisma.alertaEnviada.create({
      data: {
        obligacionId: obligacion.id,
        tipoAlerta,
        canal: CanalAlerta.SISTEMA,
        enviada: true,
        enviadaEn: new Date(),
      },
    });
  }

  private generarEmailHTML(obligacion: any, diasRestantes: number): string {
    const color = diasRestantes < 0 ? '#dc2626' : diasRestantes <= 1 ? '#f59e0b' : '#2563eb';
    const estado = diasRestantes < 0 ? 'VENCIDA' : `Vence en ${diasRestantes} día(s)`;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${color}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">${obligacion.tipoObligacion.nombre}</h2>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${estado}</p>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p><strong>Fecha de vencimiento:</strong> ${obligacion.fechaVencimiento.toLocaleDateString('es-PY')}</p>
          <p><strong>Categoría:</strong> ${obligacion.tipoObligacion.categoria}</p>
          ${obligacion.tipoObligacion.fundamentoLegal 
            ? `<p><strong>Fundamento legal:</strong> ${obligacion.tipoObligacion.fundamentoLegal}</p>` 
            : ''
          }
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Sistema de Cumplimiento Laboral - Paraguay
          </p>
        </div>
      </div>
    `;
  }

  async getHistorialAlertas(filtros?: { obligacionId?: string; desde?: Date; hasta?: Date }) {
    const where: any = {};
    if (filtros?.obligacionId) where.obligacionId = filtros.obligacionId;
    if (filtros?.desde || filtros?.hasta) {
      where.createdAt = {};
      if (filtros?.desde) where.createdAt.gte = filtros.desde;
      if (filtros?.hasta) where.createdAt.lte = filtros.hasta;
    }

    return prisma.alertaEnviada.findMany({
      where,
      include: {
        obligacion: {
          include: { tipoObligacion: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
