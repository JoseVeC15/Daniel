// backend/src/routes/notificaciones.routes.ts

import { Router } from 'express';
import { NotificacionesController } from '../controllers/notificaciones.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new NotificacionesController();

router.use(authMiddleware);

router.get('/', controller.listar);
router.get('/no-leidas/count', controller.contarNoLeidas);
router.put('/:id/leer', controller.marcarLeida);
router.put('/leer-todas', controller.marcarTodasLeidas);

export default router;
