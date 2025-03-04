import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import { 
    createDoubt, 
    getAllDoubts, 
    getDoubtById, 
    deleteDoubtById, 
    adminDeleteDoubtById 
} from '../controllers/doubtController';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/doubts
 * @desc    Create a new doubt
 * @access  Private (Authenticated users)
 */
router.post('/', isAuthenticated, upload('images', 6), createDoubt);

/**
 * @route   GET /api/doubts
 * @desc    Get all doubts
 * @access  Public
 */
router.get('/', getAllDoubts);

/**
 * @route   GET /api/doubts/:id
 * @desc    Get a specific doubt by ID
 * @access  Public
 */
router.get('/:id', getDoubtById);

/**
 * @route   DELETE /api/doubts/:id
 * @desc    Delete a doubt by ID (Only owner can delete)
 * @access  Private (Authenticated users)
 */
router.delete('/:id', isAuthenticated, deleteDoubtById);

/**
 * @route   DELETE /api/doubts/:id/admin
 * @desc    Delete a doubt by ID (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id/admin', isAuthenticated, isAdmin, adminDeleteDoubtById);

export default router;
