import { Router } from 'express';
import { savePost, unsavePost } from '../controllers/saveController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/save/:postId
 * @desc    Save a post
 * @access  Private (Authenticated users only)
 */
router.post('/:postId', isAuthenticated, savePost);

/**
 * @route   DELETE /api/save/:postId
 * @desc    Unsave a post
 * @access  Private (Authenticated users only)
 */
router.delete('/:postId', isAuthenticated, unsavePost);

export default router;
