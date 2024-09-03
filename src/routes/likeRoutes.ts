import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route to like a post
router.post('/like', isAuthenticated, likePost);

// Route to unlike a post
router.post('/unlike', isAuthenticated, unlikePost);

export default router;