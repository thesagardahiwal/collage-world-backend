import { Router } from 'express';
import { uploadStudentId, getUserDetails, getAllUsers } from '../controllers/userController';
import { authenticate } from '../utils/middleware';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/users/upload-student-id
 * @desc    Upload student ID
 * @access  Private (Authenticated users only)
 */
router.post('/upload-student-id', authenticate, uploadStudentId);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Authenticated users only)
 */
router.get('/', isAuthenticated, getAllUsers);

/**
 * @route   GET /api/users/:username
 * @desc    Get user details by username
 * @access  Private (Authenticated users only)
 */
router.get('/:username', isAuthenticated, getUserDetails);

export default router;
