import { Router } from 'express';
import { 
  createResource, 
  getResources, 
  getStreamResources, 
  removeResources 
} from '../controllers/resourceController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router: Router = Router();

/**
 * @route   POST /api/resource
 * @desc    Create a new resource
 * @access  Private (Authenticated users only)
 */
router.post('/', isAuthenticated, createResource);

/**
 * @route   GET /api/resource
 * @desc    Get all resources
 * @access  Private (Authenticated users only)
 */
router.get('/', isAuthenticated, getResources);

/**
 * @route   GET /api/resource/stream/:stream
 * @desc    Get all resources for a specific stream
 * @access  Private (Authenticated users only)
 */
router.get('/stream/:stream', isAuthenticated, getStreamResources);

/**
 * @route   DELETE /api/resource/:id
 * @desc    Delete a resource by ID
 * @access  Private (Authenticated users only)
 */
router.delete('/:id', isAuthenticated, removeResources);

export default router;
