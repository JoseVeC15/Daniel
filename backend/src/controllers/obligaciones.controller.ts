// backend/src/controllers/obligaciones.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ObligacionesService } from '../services/obligaciones.service';

const service = new ObligacionesService();

export class ObligacionesController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await service.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getProximosVencimientos(req: Request, res: Response, next: NextFunction) {
    try {
      const limite = parseInt(req.query.limite as string) || 10;
      const proximos = await service.getProximosVencimientos(limite);
      res.json(proximos);
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresMes(req: Request, res: Response, next: NextFunction) {
    try {
      const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
      const mes = parseInt(req.query.mes as string) || new Date().getMonth() + 1;
      const indicadores = await service.getIndicadoresMes(anio, mes);
      res.json(indicadores);
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado, categoria, anio, mes } = req.query;
      const obligaciones = await service.listar({
        estado: estado as string,
        categoria: categoria as string,
        anio: anio ? parseInt(anio as string) : undefined,
        mes: mes ? parseInt(mes as string) : undefined,
      });
      res.json(obligaciones);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const obligacion = await service.obtenerPorId(req.params.id);
      if (!obligacion) {
        return res.status(404).json({ error: 'Obligación no encontrada' });
      }
      res.json(obligacion);
    } catch (error) {
      next(error);
    }
  }

  async actualizarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado } = req.body;
      const obligacion = await service.actualizarEstado(req.params.id, estado);
      res.json(obligacion);
    } catch (error) {
      next(error);
    }
  }

  async marcarCumplida(req: Request, res: Response, next: NextFunction) {
    try {
      const { observaciones } = req.body;
      const obligacion = await service.marcarCumplida(req.params.id, observaciones);
      res.json(obligacion);
    } catch (error) {
      next(error);
    }
  }

  async getCalendarioMensual(req: Request, res: Response, next: NextFunction) {
    try {
      const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
      const mes = parseInt(req.query.mes as string) || new Date().getMonth() + 1;
      const calendario = await service.getCalendarioMensual(anio, mes);
      res.json(calendario);
    } catch (error) {
      next(error);
    }
  }

  async getCalendarioSemanal(req: Request, res: Response, next: NextFunction) {
    try {
      const fecha = req.query.fecha as string || new Date().toISOString();
      const calendario = await service.getCalendarioSemanal(new Date(fecha));
      res.json(calendario);
    } catch (error) {
      next(error);
    }
  }

  async getProximos30Dias(req: Request, res: Response, next: NextFunction) {
    try {
      const proximos = await service.getProximos30Dias();
      res.json(proximos);
    } catch (error) {
      next(error);
    }
  }

  async getTiposObligacion(req: Request, res: Response, next: NextFunction) {
    try {
      const tipos = await service.getTiposObligacion();
      res.json(tipos);
    } catch (error) {
      next(error);
    }
  }
}
