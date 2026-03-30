// backend/src/routes/checklist.routes.ts

import { Router } from 'express';
import { ChecklistController } from '../controllers/checklist.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const controller = new ChecklistController();
const upload = multer({ dest: 'uploads/comprobantes/' });

router.use(authMiddleware);

router.get('/mensual/:anio/:mes', controller.obtenerChecklistMensual);
router.get('/mensual/actual', controller.obtenerChecklistActual);
router.post('/generar/:anio/:mes', controller.generarChecklist);
router.put('/item/:id/completar', upload.single('comprobante'), controller.completarItem);
router.put('/item/:id/desmarcar', controller.desmarcarItem);
router.get('/historial', controller.getHistorial);

export default router;
