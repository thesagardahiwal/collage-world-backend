import { Router } from 'express';
import { savePost, unsavePost } from '../controllers/saveController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route to save a post
router.post('/save', isAuthenticated, savePost);

// Route to unsave a post
router.post('/unsave', isAuthenticated, unsavePost);

export default router;