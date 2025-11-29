import { Router } from 'express';
import {
  generateReport,
  getReports,
  downloadReport,
} from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getReports);
router.post('/:verificationId/generate', generateReport);
router.get('/:verificationId/download', downloadReport);

export default router;
