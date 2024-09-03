import express from 'express';
import multer from 'multer';
import { uploadResource, getResourceById, updateResourceById, deleteResourceById } from '../controllers/eduResourceController';

const router = express.Router();
const upload = multer({ dest: 'collageWorld/' });  // Directory for temporary file storage

// Route to upload a resource (one at a time)
router.post('/resources/upload', upload.single('resource'), uploadResource);

// Route to get a resource by ID
router.get('/resources/:id', getResourceById);

// Route to update a resource by ID
router.put('/resources/:id', upload.single('resource'), updateResourceById);

// Route to delete a resource by ID
router.delete('/resources/:id', deleteResourceById);

export default router;