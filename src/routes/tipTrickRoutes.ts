import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import { 
    createTipTrick, 
    getAllTipsTricks, 
    getTipTrickById, 
    updateTipTrickById, 
    deleteTipTrickById, 
    adminGetAllTipsTricks, 
    adminDeleteTipTrickById 
} from '../controllers/tipTrickController';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/tiptricks
 * @desc    Create a new tip or trick
 * @access  Private (Authenticated users only)
 */
router.post('/', isAuthenticated, upload('images', 5), createTipTrick);

/**
 * @route   GET /api/tiptricks
 * @desc    Get all tips and tricks
 * @access  Public
 */
router.get('/', getAllTipsTricks);

/**
 * @route   GET /api/tiptricks/:id
 * @desc    Get a single tip or trick by ID
 * @access  Public
 */
router.get('/:id', getTipTrickById);

/**
 * @route   PUT /api/tiptricks/:id
 * @desc    Update a tip or trick by ID
 * @access  Private (Authenticated users only)
 */
router.put('/:id', isAuthenticated, upload('images', 5), updateTipTrickById);

/**
 * @route   DELETE /api/tiptricks/:id
 * @desc    Delete a tip or trick by ID
 * @access  Private (Authenticated users only)
 */
router.delete('/:id', isAuthenticated, deleteTipTrickById);

/**
 * @route   DELETE /api/tiptricks/admin/:id
 * @desc    Admin: Delete any tip or trick by ID
 * @access  Private (Admin only)
 */
router.delete('/admin/:id', isAuthenticated, isAdmin, adminDeleteTipTrickById);

/**
 * @route   GET /api/tiptricks/admin
 * @desc    Admin: Get all tips and tricks
 * @access  Private (Admin only)
 */
router.get('/admin', isAuthenticated, isAdmin, adminGetAllTipsTricks);

export default router;
