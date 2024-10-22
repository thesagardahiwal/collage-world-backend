import { Router } from 'express';
import { createResource, getResources, removeResources } from '../controllers/resourceController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/create', isAuthenticated, createResource);
router.get('/get', isAuthenticated, getResources);
router.delete('/:id', isAuthenticated, removeResources);

export default router;