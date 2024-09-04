import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import { postAnswer, getAnswersByDoubtId, updateAnswerById, deleteAnswerById, adminDeleteAnswerById } from '../controllers/answerController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/authMiddleware'; // Import the admin middleware

const router = express.Router();

// Post a new answer
router.post('/', isAuthenticated, upload('images', 6), postAnswer);

// Get all answers for a specific doubt
router.get('/doubt/:doubtId', getAnswersByDoubtId);

// Update an answer by ID
router.put('/:id', isAuthenticated, upload('images', 6), updateAnswerById);

// Delete an answer by ID (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, adminDeleteAnswerById);

export default router;