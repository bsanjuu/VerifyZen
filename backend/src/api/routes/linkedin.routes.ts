import { Router } from 'express';
import {
  scrapeLinkedInProfile,
  getLinkedInData,
  validateLinkedInProfile,
} from '../controllers/linkedin.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/:candidateId/scrape', scrapeLinkedInProfile);
router.get('/:candidateId/data', getLinkedInData);
router.post('/:candidateId/validate', validateLinkedInProfile);

export default router;
