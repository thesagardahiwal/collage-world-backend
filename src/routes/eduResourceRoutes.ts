import express from 'express';
import { uploadFilesToCloudinary as upload } from '../config/claudinary';
import { uploadResource, getResourceById, updateResourceById, deleteResourceById, getAllResources, adminDeleteResource } from '../controllers/eduResourceController';

const router = express.Router();

// Route to upload a resource (one at a time)
router.post('/upload', upload('resource', 1), uploadResource);

// Route to get a resource by ID
router.get('/:id', getResourceById);

// Route to update a resource by ID
router.put('/:id', upload('resource', 1), updateResourceById);

// Route to delete a resource by ID
router.delete('/:id', deleteResourceById);

// Admin routes
router.get('/admin', getAllResources);  // Get all resources for admin
router.delete('/admin/:id', adminDeleteResource);  // Admin delete any resource

export default router;