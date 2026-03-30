// backend/src/controllers/reportes.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ReportesService } from '../services/reportes.service';

const service = new ReportesService();

export class ReportesController {
  async reporteCumplimiento(req: Request, res: Response, next: NextFunction) {
    try {
      const anioDesde = parseInt(req.query.anioDesde as string) || new Date().getFullYear();
      const anioHasta = parseInt(req.query.anioHasta as string) || new Date().getFullYear();
      const reporte = await service.reporteCumplimiento(anioDesde, anioHasta);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async reporteMensual(req: Request, res: Response, next: NextFunction) {
    try {
      const anio = parseInt(req.params.anio);
      const mes = parseInt(req.params.mes);
      const reporte = await service.reporteMensual(anio, mes);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async reporteAuditoria(req: Request, res: Response, next: NextFunction) {
    try {
      const desde = new Date(req.query.desde as string || new Date().toISOString());
      const hasta = new Date(req.query.hasta as string || new Date().toISOString());
      const reporte = await service.reporteAuditoria(desde, hasta);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async exportarPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const buffer = await service.generarPDF(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async exportarExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const buffer = await service.generarExcel(data);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}
