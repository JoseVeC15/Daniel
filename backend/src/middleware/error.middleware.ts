// backend/src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[ERROR]', error.message, error.stack);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: error.message,
    });
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Error en la base de datos',
      detalles: error.message,
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}
