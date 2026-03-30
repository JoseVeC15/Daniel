// backend/src/controllers/calculadoras.controller.ts

import { Request, Response, NextFunction } from 'express';
import { CalculadorasService } from '../services/calculadoras.service';

const service = new CalculadorasService();

export class CalculadorasController {
  async calcularAguinaldo(req: Request, res: Response, next: NextFunction) {
    try {
      const { salarioMensual, mesesTrabajados, otrosIngresos } = req.body;
      const resultado = await service.calcularAguinaldo({
        salarioMensual,
        mesesTrabajados: mesesTrabajados || 6,
        otrosIngresos: otrosIngresos || 0,
      });
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async calcularIPS(req: Request, res: Response, next: NextFunction) {
    try {
      const { salarioBruto } = req.body;
      const resultado = await service.calcularIPS(salarioBruto);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async calcularVacaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaIngreso, salarioMensual } = req.body;
      const resultado = await service.calcularVacaciones({
        fechaIngreso: new Date(fechaIngreso),
        salarioMensual,
      });
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getParametrosVigentes(req: Request, res: Response, next: NextFunction) {
    try {
      const parametros = await service.getParametrosVigentes();
      res.json(parametros);
    } catch (error) {
      next(error);
    }
  }
}
