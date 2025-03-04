import { Router } from 'express';
import { followUser, getFollowers, getFollowing, unfollowUser } from '../controllers/followController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/follows/:userId/followers
 * @desc    Get all followers of a user
 * @access  Private (Authenticated users)
 */
router.get('/:userId/followers', isAuthenticated, getFollowers);

/**
 * @route   GET /api/follows/:userId/following
 * @desc    Get all users followed by a user
 * @access  Private (Authenticated users)
 */
router.get('/:userId/following', isAuthenticated, getFollowing);

/**
 * @route   POST /api/follows/:userId
 * @desc    Follow a user
 * @access  Private (Authenticated users)
 */
router.post('/:userId', isAuthenticated, followUser);

/**
 * @route   DELETE /api/follows/:userId
 * @desc    Unfollow a user
 * @access  Private (Authenticated users)
 */
router.delete('/:userId', isAuthenticated, unfollowUser);

export default router;
