import { Router } from 'express';
import { getAllReels } from '../controllers/reelController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router: Router = Router();

/**
 * @route   GET /api/reels
 * @desc    Get all reels
 * @access  Public
 */
router.get('/', getAllReels);

export default router;
