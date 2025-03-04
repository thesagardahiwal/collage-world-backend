import { Router } from 'express';
import { getAllReels } from '../controllers/reelController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router: Router = Router();

router.get('/', getAllReels);

export default router;