// backend/src/controllers/alertas.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AlertasService } from '../services/alertas.service';

const service = new AlertasService();

export class AlertasController {
  async obtenerConfiguracion(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      const config = await service.obtenerConfiguracion(usuarioId);
      res.json(config);
    } catch (error) {
      next(error);
    }
  }

  async actualizarConfiguracion(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      const config = await service.actualizarConfiguracion(usuarioId, req.body);
      res.json(config);
    } catch (error) {
      next(error);
    }
  }

  async getHistorialAlertas(req: Request, res: Response, next: NextFunction) {
    try {
      const { obligacionId, desde, hasta } = req.query;
      const historial = await service.getHistorialAlertas({
        obligacionId: obligacionId as string,
        desde: desde ? new Date(desde as string) : undefined,
        hasta: hasta ? new Date(hasta as string) : undefined,
      });
      res.json(historial);
    } catch (error) {
      next(error);
    }
  }
}
