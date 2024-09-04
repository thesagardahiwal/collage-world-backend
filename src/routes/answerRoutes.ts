import express from 'express';
import { postAnswer, getAnswersByDoubtId, updateAnswerById, deleteAnswerById, adminDeleteAnswerById } from '../controllers/answerController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/authMiddleware'; // Import the admin middleware
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust as needed

// Post a new answer
router.post('/', isAuthenticated, upload.array('images', 6), postAnswer);

// Get all answers for a specific doubt
router.get('/doubt/:doubtId', getAnswersByDoubtId);

// Update an answer by ID
router.put('/:id', isAuthenticated, upload.array('images', 6), updateAnswerById);

// Delete an answer by ID (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, adminDeleteAnswerById);

export default router;