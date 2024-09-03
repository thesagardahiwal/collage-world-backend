import { Router } from 'express';
import { createResource, getResources } from '../controllers/resourceController';
import { authenticate } from '../utils/middleware';

const router: Router = Router();

router.post('/create', authenticate, createResource);
router.get('/get', authenticate, getResources);

export default router;