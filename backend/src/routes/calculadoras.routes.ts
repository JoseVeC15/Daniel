// backend/src/routes/calculadoras.routes.ts

import { Router } from 'express';
import { CalculadorasController } from '../controllers/calculadoras.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new CalculadorasController();

router.use(authMiddleware);

router.post('/aguinaldo', controller.calcularAguinaldo);
router.post('/ips', controller.calcularIPS);
router.post('/vacaciones', controller.calcularVacaciones);
router.get('/parametros', controller.getParametrosVigentes);

export default router;
