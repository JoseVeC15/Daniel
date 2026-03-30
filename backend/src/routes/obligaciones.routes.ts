// backend/src/routes/obligaciones.routes.ts

import { Router } from 'express';
import { ObligacionesController } from '../controllers/obligaciones.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ObligacionesController();

router.use(authMiddleware);

// Dashboard
router.get('/dashboard', controller.getDashboard);
router.get('/proximos-vencimientos', controller.getProximosVencimientos);
router.get('/indicadores-mes', controller.getIndicadoresMes);

// CRUD Obligaciones
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.put('/:id/estado', controller.actualizarEstado);
router.put('/:id/cumplir', controller.marcarCumplida);

// Calendario
router.get('/calendario/mensual', controller.getCalendarioMensual);
router.get('/calendario/semanal', controller.getCalendarioSemanal);
router.get('/calendario/proximos-30', controller.getProximos30Dias);

// Tipos
router.get('/tipos/todos', controller.getTiposObligacion);

export default router;
