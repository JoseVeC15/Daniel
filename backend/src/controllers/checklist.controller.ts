// backend/src/controllers/checklist.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ChecklistService } from '../services/checklist.service';

const service = new ChecklistService();

export class ChecklistController {
  async obtenerChecklistActual(req: Request, res: Response, next: NextFunction) {
    try {
      const ahora = new Date();
      const checklist = await service.obtenerOCrear(ahora.getFullYear(), ahora.getMonth() + 1);
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  async obtenerChecklistMensual(req: Request, res: Response, next: NextFunction) {
    try {
      const { anio, mes } = req.params;
      const checklist = await service.obtenerOCrear(parseInt(anio), parseInt(mes));
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  async generarChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const { anio, mes } = req.params;
      const checklist = await service.generar(parseInt(anio), parseInt(mes));
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  async completarItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { observaciones } = req.body;
      const comprobanteUrl = req.file?.path;
      const comprobanteNombre = req.file?.originalname;
      const usuarioId = (req as any).usuario.id;

      const item = await service.completarItem(id, {
        usuarioId,
        observaciones,
        comprobanteUrl,
        comprobanteNombre,
      });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async desmarcarItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await service.desmarcarItem(id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async getHistorial(req: Request, res: Response, next: NextFunction) {
    try {
      const { anioDesde, anioHasta } = req.query;
      const historial = await service.getHistorial(
        parseInt(anioDesde as string) || new Date().getFullYear(),
        parseInt(anioHasta as string) || new Date().getFullYear()
      );
      res.json(historial);
    } catch (error) {
      next(error);
    }
  }
}
