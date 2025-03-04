import express from 'express';
import { uploadFilesToCloudinary as upload } from '../config/claudinary';
import { 
    uploadResource, 
    getResourceById, 
    updateResourceById, 
    deleteResourceById, 
    getAllResources, 
    adminDeleteResource 
} from '../controllers/eduResourceController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/edu-resources
 * @desc    Upload a new educational resource
 * @access  Private (Authenticated users)
 */
router.post('/', isAuthenticated, upload('resource', 1), uploadResource);

/**
 * @route   GET /api/edu-resources/:id
 * @desc    Get an educational resource by ID
 * @access  Public
 */
router.get('/:id', getResourceById);

/**
 * @route   PUT /api/edu-resources/:id
 * @desc    Update an educational resource by ID
 * @access  Private (Authenticated users)
 */
router.put('/:id', isAuthenticated, upload('resource', 1), updateResourceById);

/**
 * @route   DELETE /api/edu-resources/:id
 * @desc    Delete an educational resource by ID
 * @access  Private (Authenticated users)
 */
router.delete('/:id', isAuthenticated, deleteResourceById);

/**
 * @route   GET /api/edu-resources/admin
 * @desc    Get all educational resources (Admin only)
 * @access  Private (Admin only)
 */
router.get('/admin', isAuthenticated, isAdmin, getAllResources);

/**
 * @route   DELETE /api/edu-resources/admin/:id
 * @desc    Delete an educational resource by ID (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/admin/:id', isAuthenticated, isAdmin, adminDeleteResource);

export default router;
