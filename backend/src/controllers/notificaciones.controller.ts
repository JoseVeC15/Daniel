// backend/src/controllers/notificaciones.controller.ts

import { Request, Response, NextFunction } from 'express';
import { NotificacionesService } from '../services/notificaciones.service';

const service = new NotificacionesService();

export class NotificacionesController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      const notificaciones = await service.listar(usuarioId);
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  }

  async contarNoLeidas(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      const count = await service.contarNoLeidas(usuarioId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  async marcarLeida(req: Request, res: Response, next: NextFunction) {
    try {
      await service.marcarLeida(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async marcarTodasLeidas(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      await service.marcarTodasLeidas(usuarioId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
