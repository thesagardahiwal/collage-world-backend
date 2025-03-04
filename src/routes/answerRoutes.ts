import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import { 
  postAnswer, 
  getAnswersByDoubtId, 
  updateAnswerById, 
  deleteAnswerById, 
  adminDeleteAnswerById 
} from '../controllers/answerController';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/answers
 * @desc    Post a new answer (with optional image upload)
 * @access  Private (Authenticated users)
 */
router.post('/', isAuthenticated, upload('answers', 6), postAnswer);

/**
 * @route   GET /api/answers/doubt/:doubtId
 * @desc    Get all answers for a specific doubt
 * @access  Public
 */
router.get('/doubt/:doubtId', getAnswersByDoubtId);

/**
 * @route   PUT /api/answers/:id
 * @desc    Update an answer by ID (with optional image upload)
 * @access  Private (Authenticated users)
 */
router.put('/:id', isAuthenticated, upload('answers', 6), updateAnswerById);

/**
 * @route   DELETE /api/answers/:id
 * @desc    Delete an answer by ID
 * @access  Private (Authenticated users)
 */
router.delete('/:id', isAuthenticated, deleteAnswerById);

/**
 * @route   DELETE /api/answers/admin/:id
 * @desc    Admin-only: Delete any answer by ID
 * @access  Private (Admin only)
 */
router.delete('/admin/:id', isAuthenticated, isAdmin, adminDeleteAnswerById);

export default router;
