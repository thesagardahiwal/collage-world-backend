import { Router } from 'express';
import { followUser, getFollowers, getFollowing, unfollowUser } from '../controllers/followController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.get('/followers/:id', isAuthenticated, getFollowers);

router.get('/following/:id', isAuthenticated, getFollowing);

// Route to follow a user
router.post('/follow', isAuthenticated, followUser);

// Route to unfollow a user
router.post('/unfollow', isAuthenticated, unfollowUser);

export default router;