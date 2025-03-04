import express from 'express';
import { 
    createEducation, 
    getEducation, 
    getEducationById 
} from '../controllers/educationController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/education
 * @desc    Create a new education entry
 * @access  Private (Authenticated users)
 */
router.post('/', isAuthenticated, createEducation);

/**
 * @route   GET /api/education
 * @desc    Get all education entries
 * @access  Public
 */
router.get('/', getEducation);

/**
 * @route   GET /api/education/:id
 * @desc    Get a specific education entry by ID
 * @access  Public
 */
router.get('/:id', getEducationById);

export default router;
