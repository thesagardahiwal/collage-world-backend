import express from 'express';
import multer from 'multer';
import { uploadResource, getResourceById, updateResourceById, deleteResourceById, getAllResources, adminDeleteResource } from '../controllers/eduResourceController';

const router = express.Router();
const upload = multer({ dest: 'collageWorld/' });  // Directory for temporary file storage

// Route to upload a resource (one at a time)
router.post('/upload', upload.single('resource'), uploadResource);

// Route to get a resource by ID
router.get('/:id', getResourceById);

// Route to update a resource by ID
router.put('/:id', upload.single('resource'), updateResourceById);

// Route to delete a resource by ID
router.delete('/:id', deleteResourceById);

// Admin routes
router.get('/admin', getAllResources);  // Get all resources for admin
router.delete('/admin/:id', adminDeleteResource);  // Admin delete any resource

export default router;