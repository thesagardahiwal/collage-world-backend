import { Router } from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/commentController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route to create a new comment
router.post('/comment', isAuthenticated, createComment);

// Route to update an existing comment
router.put('/comment', isAuthenticated, updateComment);

// Route to delete a comment
router.delete('/comment', isAuthenticated, deleteComment);

export default router;