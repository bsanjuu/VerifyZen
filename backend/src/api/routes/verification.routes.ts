import { Router } from 'express';
import {
  startVerification,
  getVerifications,
  getVerificationById,
  updateVerification,
  deleteVerification,
} from '../controllers/verification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', startVerification);
router.get('/', getVerifications);
router.get('/:id', getVerificationById);
router.put('/:id', updateVerification);
router.delete('/:id', deleteVerification);

export default router;
