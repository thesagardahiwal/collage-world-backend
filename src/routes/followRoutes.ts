import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/followController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route to follow a user
router.post('/follow', isAuthenticated, followUser);

// Route to unfollow a user
router.post('/unfollow', isAuthenticated, unfollowUser);

export default router;