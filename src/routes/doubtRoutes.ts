import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import { createDoubt, getAllDoubts, getDoubtById, deleteDoubtById, adminDeleteDoubtById } from '../controllers/doubtController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/authMiddleware'; // Import the admin middleware

const router = express.Router();

// Create a new doubt
router.post('/', isAuthenticated, upload('images', 6), createDoubt);

// Get all doubts
router.get('/', getAllDoubts);

// Get a doubt by ID
router.get('/:id', getDoubtById);

// Delete a doubt by ID

router.delete('/:id', isAuthenticated, deleteDoubtById)

// Delete a doubt by ID (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, adminDeleteDoubtById);

export default router;