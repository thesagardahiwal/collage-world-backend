import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/likes/:postId
 * @desc    Like a post
 * @access  Private (Authenticated users)
 */
router.post('/:postId', isAuthenticated, likePost);

/**
 * @route   DELETE /api/likes/:postId
 * @desc    Unlike a post
 * @access  Private (Authenticated users)
 */
router.delete('/:postId', isAuthenticated, unlikePost);

export default router;
