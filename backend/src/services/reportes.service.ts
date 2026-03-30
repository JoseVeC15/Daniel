// backend/src/services/reportes.service.ts

import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export class ReportesService {

  async reporteCumplimiento(anioDesde: number, anioHasta: number) {
    const obligaciones = await prisma.obligacion.findMany({
      where: {
        anio: { gte: anioDesde, lte: anioHasta },
      },
      include: { tipoObligacion: true },
      orderBy: [{ anio: 'asc' }, { mes: 'asc' }],
    });

    // Agrupar por mes
    const porMes: Record<string, any> = {};
    for (const ob of obligaciones) {
      const key = `${ob.anio}-${String(ob.mes || 0).padStart(2, '0')}`;
      if (!porMes[key]) {
        porMes[key] = { periodo: key, total: 0, cumplidas: 0, vencidas: 0, pendientes: 0 };
      }
      porMes[key].total++;
      if (ob.estado === 'CUMPLIDO') porMes[key].cumplidas++;
      else if (ob.estado === 'VENCIDO') porMes[key].vencidas++;
      else porMes[key].pendientes++;
    }

    return {
      periodo: { desde: anioDesde, hasta: anioHasta },
      resumenGeneral: {
        total: obligaciones.length,
        cumplidas: obligaciones.filter(o => o.estado === 'CUMPLIDO').length,
        vencidas: obligaciones.filter(o => o.estado === 'VENCIDO').length,
        pendientes: obligaciones.filter(o => o.estado === 'PENDIENTE' || o.estado === 'PROXIMO').length,
      },
      detallePorMes: Object.values(porMes),
      obligaciones,
    };
  }

  async reporteMensual(anio: number, mes: number) {
    const [obligaciones, checklist] = await Promise.all([
      prisma.obligacion.findMany({
        where: { anio, mes },
        include: { tipoObligacion: true },
      }),
      prisma.checklistMensual.findUnique({
        where: { anio_mes: { anio, mes } },
        include: {
          items: {
            include: {
              itemTemplate: true,
              completadoPor: { select: { nombre: true } },
            },
          },
        },
      }),
    ]);

    return {
      periodo: { anio, mes },
      obligaciones,
      checklist,
      generadoEn: new Date(),
    };
  }

  async reporteAuditoria(desde: Date, hasta: Date) {
    const [completados, alertas] = await Promise.all([
      prisma.checklistCompletado.findMany({
        where: {
          fechaCompletado: { gte: desde, lte: hasta },
          completado: true,
        },
        include: {
          itemTemplate: true,
          completadoPor: { select: { nombre: true, email: true } },
          checklistMensual: true,
        },
        orderBy: { fechaCompletado: 'desc' },
      }),
      prisma.alertaEnviada.findMany({
        where: {
          createdAt: { gte: desde, lte: hasta },
        },
        include: {
          obligacion: { include: { tipoObligacion: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      periodo: { desde, hasta },
      actividadesCompletadas: completados,
      alertasEnviadas: alertas,
      generadoEn: new Date(),
    };
  }

  async generarPDF(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(20).text('Reporte de Cumplimiento Laboral', { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-PY')}`, { align: 'center' });
      doc.moveDown(2);

      // Resumen
      if (data.resumenGeneral) {
        doc.fontSize(14).text('Resumen General');
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text(`Total obligaciones: ${data.resumenGeneral.total}`);
        doc.text(`Cumplidas: ${data.resumenGeneral.cumplidas}`);
        doc.text(`Vencidas: ${data.resumenGeneral.vencidas}`);
        doc.text(`Pendientes: ${data.resumenGeneral.pendientes}`);
        doc.moveDown();
      }

      // Detalle
      if (data.obligaciones) {
        doc.fontSize(14).text('Detalle de Obligaciones');
        doc.moveDown(0.5);
        doc.fontSize(9);

        for (const ob of data.obligaciones) {
          doc.text(
            `${ob.tipoObligacion?.nombre || 'N/A'} | ` +
            `Venc: ${new Date(ob.fechaVencimiento).toLocaleDateString('es-PY')} | ` +
            `Estado: ${ob.estado}`
          );
        }
      }

      doc.end();
    });
  }

  async generarExcel(data: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Hoja: Obligaciones
    const sheet = workbook.addWorksheet('Obligaciones');
    sheet.columns = [
      { header: 'Obligación', key: 'nombre', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Vencimiento', key: 'vencimiento', width: 15 },
      { header: 'Estado', key: 'estado', width: 12 },
      { header: 'Cumplimiento', key: 'cumplimiento', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];

    // Estilos del header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    if (data.obligaciones) {
      for (const ob of data.obligaciones) {
        sheet.addRow({
          nombre: ob.tipoObligacion?.nombre || 'N/A',
          categoria: ob.tipoObligacion?.categoria || 'N/A',
          vencimiento: new Date(ob.fechaVencimiento).toLocaleDateString('es-PY'),
          estado: ob.estado,
          cumplimiento: ob.fechaCumplimiento 
            ? new Date(ob.fechaCumplimiento).toLocaleDateString('es-PY') 
            : '-',
          observaciones: ob.observaciones || '',
        });
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
