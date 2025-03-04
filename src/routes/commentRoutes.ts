import { Router } from 'express';
import { createComment, updateComment, deleteComment, getCommentById } from '../controllers/commentController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/comments
 * @desc    Create a new comment
 * @access  Private (Authenticated users)
 */
router.post('/', isAuthenticated, createComment);

/**
 * @route   GET /api/comments/:id
 * @desc    Get a comment by ID
 * @access  Public
 */
router.get('/:id', getCommentById);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update an existing comment
 * @access  Private (Authenticated users)
 */
router.put('/:id', isAuthenticated, updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment by ID
 * @access  Private (Authenticated users)
 */
router.delete('/:id', isAuthenticated, deleteComment);

export default router;
