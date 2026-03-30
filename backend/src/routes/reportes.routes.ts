// backend/src/routes/reportes.routes.ts

import { Router } from 'express';
import { ReportesController } from '../controllers/reportes.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ReportesController();

router.use(authMiddleware);

router.get('/cumplimiento', controller.reporteCumplimiento);
router.get('/mensual/:anio/:mes', controller.reporteMensual);
router.get('/auditoria', controller.reporteAuditoria);
router.post('/exportar/pdf', controller.exportarPDF);
router.post('/exportar/excel', controller.exportarExcel);

export default router;
