// backend/src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await service.register(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario.id;
      const user = await service.obtenerPerfil(usuarioId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
