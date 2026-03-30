// backend/src/routes/index.ts

import { Router } from 'express';
import obligacionesRoutes from './obligaciones.routes';
import checklistRoutes from './checklist.routes';
import alertasRoutes from './alertas.routes';
import calculadorasRoutes from './calculadoras.routes';
import reportesRoutes from './reportes.routes';
import notificacionesRoutes from './notificaciones.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/obligaciones', obligacionesRoutes);
router.use('/checklist', checklistRoutes);
router.use('/alertas', alertasRoutes);
router.use('/calculadoras', calculadorasRoutes);
router.use('/reportes', reportesRoutes);
router.use('/notificaciones', notificacionesRoutes);

export default router;
