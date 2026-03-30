// backend/src/routes/alertas.routes.ts

import { Router } from 'express';
import { AlertasController } from '../controllers/alertas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AlertasController();

router.use(authMiddleware);

router.get('/configuracion', controller.obtenerConfiguracion);
router.put('/configuracion', controller.actualizarConfiguracion);
router.get('/historial', controller.getHistorialAlertas);

export default router;
